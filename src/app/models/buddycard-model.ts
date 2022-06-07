export class BuddyCard {
  constructor(
    public uuid: string,
    public firstName: string,
    public lastName: string,
    public instrument: string,
    public deletable: boolean,
    public addable: boolean,
    public recommendable: boolean,
    public status: string
  ) {}
}
