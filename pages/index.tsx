import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { GetStaticProps } from 'next'
type Props = {
  contentHtml: string
}
const Home: React.FC<Props> = ({ contentHtml }) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const fullPath = path.join(process.cwd(), "readme.md")
  const fileContents = fs.readFileSync(fullPath, "utf8")

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Use remark to convert markdown into HTML string
  const processedContent = await remark().use(html).process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id and contentHtml
  return {
    props: {
      contentHtml,
    }
  }
}

export default Home
