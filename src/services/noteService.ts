import axios from "axios";
import type { Note } from "../types/note";

// ============ KONSTANTEN ============
const API_BASE = "https://notehub-public.goit.study/api";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

// ============ AXIOS INSTANCE ============
const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

// ============ TYPES ============
interface fetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

// ============ FUNCTIONS ============
// ============GET===========
export async function fetchNotes(
  params: fetchNotesParams,
): Promise<FetchNotesResponse> {
  const response = await axiosInstance.get<FetchNotesResponse>("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      ...(params.search && { search: params.search }),
    },
  });

  return response.data;
}

// ============POST===========
export async function createNote(noteData: CreateNoteRequest): Promise<Note> {
  const response = await axiosInstance.post<Note>("/notes", noteData);

  return response.data;
}

// ============DELETE===========

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await axiosInstance.delete<Note>(`/notes/${noteId}`);
  return response.data;
}
