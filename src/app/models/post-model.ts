export class Post {
  constructor(
    public uuid: string,
    public authorUuid: string,
    public authorName: string,
    public picPost: string,
    public content: string,
    public avatar: string,
    public date: string
  ) {}
}
