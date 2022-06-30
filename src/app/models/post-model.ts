export class Post {
  constructor(
    public uuid: string,
    public author_uuid: string,
    public author_name: string,
    public recipient_uuid: string,
    public picPost: string,
    public content: string,
    public avatar: boolean,
    public date: string
  ) {}
}
