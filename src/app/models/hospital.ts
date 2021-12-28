export interface IHospital {
  _id: string;
  nombre: string;
  img?: string;
  usuario?: _HospitalUser;
}

interface _HospitalUser {
  nombre: string;
  img: string;
}
