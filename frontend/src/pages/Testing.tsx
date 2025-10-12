import Text from '../markdown/example.mdx'
import { Code } from '../components/Code';
import { Info } from '../components/Info';
import { LinkRow } from '../components/LinkRow';
import { LinksTable } from '../components/LinksTable';
import { SectionTitle } from '../components/SectionTitle';
import { TaskRow } from '../components/TaskRow';
import { TasksTable } from '../components/TasksTable';
import { Warning } from '../components/Warning';
import { Tag } from '../components/Tag';
import { SectionContent } from '../components/SectionContent';
import { FocusProblem } from '../components/FocusProblem';

const components = {
    SectionTitle,
    Code,
    Warning,
    Info,
    LinkRow,
    LinksTable,
    TaskRow,
    TasksTable,
    Tag,
    SectionContent,
    FocusProblem
};

export const Testing = () => {
  return (
    // <MDXProvider components={components}>
        <Text components={components} />
    // </MDXProvider>
  )
}
