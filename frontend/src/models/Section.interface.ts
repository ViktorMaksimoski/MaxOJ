import type { Link } from "./Link.interface";

export interface Section {
    section_title: string;
    section_content: string;
    code: string;
    links: Link[];
}