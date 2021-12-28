export interface IMedico {
  _id: string;
  nombre: string;
  img?: string;
  usuario?: _MedicoUser;
  hospital?: _MedicoHospital;
}

interface _MedicoUser {
  nombre: string;
  img: string;
}

interface _MedicoHospital {
  _id: string;
  nombre: string;
  img: string;
}
