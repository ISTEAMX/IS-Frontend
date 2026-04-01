export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}

export interface TeacherDTO extends Omit<Teacher, "id"> {
  id?: number;
}
