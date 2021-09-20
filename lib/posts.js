import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postDirectory, fileName);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContent);

    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    }
    if (b > a) {
      return -1;
    } else {
      return 0;
    }
  });
}
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const matterResult = matter(fileContent);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return { id, contentHtml, ...matterResult.data };
}
