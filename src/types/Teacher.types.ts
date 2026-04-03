export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
  department: string;
}

export interface TeacherDTO extends Omit<Teacher, "id"> {
  id?: number;
}
