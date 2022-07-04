export class Buddy {
  constructor(
    public uuid: string,
    public login: string,
    public firstName: string,
    public password: string,
    public mailAddress: string,
    public lastName: string,
    public gender: string,
    public birthDate: Date,
    public location: string,
    public profilePicture: string,
    public bio: string,
    public role: string,
    public online: boolean,
    public instrument: string,
    public singer: string,
    public pro: string,
    public status: string,
    public style: string,
    public group: string,
    public deletable: boolean
  ) {}
}
