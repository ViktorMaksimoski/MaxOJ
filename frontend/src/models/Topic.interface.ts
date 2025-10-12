export interface LectionLink {
    name: string;
    code: string;
};

export interface Topic {
    topic_name: string;
    lections: LectionLink[];
};