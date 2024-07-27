export interface PostEntity {
    id?: number;
    content: string;
    title: string;
    authorId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date
};

export interface GetPostEntity {
    page?: number;
    pageSize?: number;
    authorId?: number;
    q?: string;
}