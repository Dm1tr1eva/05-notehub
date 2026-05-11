import axios from "axios";
import type { Note } from "../types/note";

interface NotesHttpResponse {
  results: Note[];
  total_pages: number;
}

export async function fetchNotes(
  query: string,
  page: number = 1,
): Promise<NotesHttpResponse> {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  const response = await axios.get<NotesHttpResponse>(
    "https://notehub-public.goit.study/api/docs",
    {
      params: {
        query: query,
        page: page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}
// export function createNote(){}
// export function deleteNote(){}
