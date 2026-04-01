export interface Group {
  id: number;
  name: string;
  specialization: string;
  year: number;
}

export interface GroupDTO extends Omit<Group, "id"> {
  id?: number;
}
