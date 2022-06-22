// export interface Buddy {
//   uuId: string;
//   login: string;
//   firstName: string;
//   lastName: string;
//   gender: string;
//   birthDate: Date;
//   location: string;
//   profilePicture: string;
//   bannerPicture: string;
//   bio: string;
//   role: string;
//   online: boolean;
//   instrument: string;
//   singer: string;
//   // group: string;
//   professionnal: string;
//   status: string;
//   deletable: boolean;
//   addable: boolean;
//   recommendable: boolean;
// }
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
    public bannerPicture: string,
    public bio: string,
    public role: string,
    public online: boolean,
    public instrument: string,
    public singer: string,
    public pro: string,
    public status: string,
    public deletable: boolean //     public config: { //   addable: boolean; //   acceptable: boolean;
  ) //   rejectable: boolean;
  //   recommendable: boolean;
  //   deletable: boolean;
  //   status: string;
  // }
  {}
}
