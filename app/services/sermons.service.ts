import { HTTP } from "./http";
import type {
  PaginationOptions,
  PaginationResponse,
} from "./interfaces/pagination.interface";
import type { CResponse } from "./interfaces/Response.interface";

export enum SermonPdfType {
  PEWSHEET = "Pewsheet",
  READINGS = "Readings",
  SERMON = "sermon",
}

export interface SermonPdfFile {
  type: SermonPdfType;
  url: string;
}

export interface SermonItem {
  id: string;
  title: string;
  description: string | null;
  reflection: string | null;
  preacher: string;
  sermonDate: string;
  pdfFiles: SermonPdfFile[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSermon {
  title: string;
  description?: string | null;
  reflection?: string | null;
  preacher: string;
  sermonDate: string;
  pdfFiles?: SermonPdfFile[];
}

export type UpdateSermon = Partial<CreateSermon>;

const normalizeSermon = (sermon: SermonItem): SermonItem => {
  const baseUrl = HTTP.defaults.baseURL

  return {
    ...sermon,
    pdfFiles: sermon.pdfFiles.map((pdf) => ({
      ...pdf,
      url: `${baseUrl}${pdf.url}`,
    })),
  };
};

export const SermonsService = {
  async getAll(params: PaginationOptions) {
    const response = await HTTP.get<PaginationResponse<SermonItem>>(
      "/sermons",
      { params },
    );

    return {
      ...response.data,
      data: {
        ...response.data.data,
        items: response.data.data.items.map(normalizeSermon),
      },
    };
  },

  async getById(id: string): Promise<CResponse<SermonItem>> {
    const response = await HTTP.get<CResponse<SermonItem>>(`/sermons/${id}`);

    return {
      ...response.data,
      data: normalizeSermon(response.data.data),
    };
  },

  async getGospel(): Promise<CResponse<SermonItem>> {
    const response = await HTTP.get<CResponse<SermonItem>>("/sermons/gospel");

    return {
      ...response.data,
      data: normalizeSermon(response.data.data),
    };
  },

  async create(data: CreateSermon): Promise<CResponse<SermonItem>> {
    const response = await HTTP.post<CResponse<SermonItem>>("/sermons", data);

    return {
      ...response.data,
      data: normalizeSermon(response.data.data),
    };
  },

  async update(id: string, data: UpdateSermon): Promise<CResponse<SermonItem>> {
    const response = await HTTP.patch<CResponse<SermonItem>>(
      `/sermons/${id}`,
      data,
    );

    return {
      ...response.data,
      data: normalizeSermon(response.data.data),
    };
  },

  async uploadPdf(
    id: string,
    file: File,
    type: SermonPdfType,
  ): Promise<CResponse<SermonItem>> {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("type", type);

    const response = await HTTP.post<CResponse<SermonItem>>(
      `/sermons/${id}/pdf`,
      formData,
    );

    return {
      ...response.data,
      data: normalizeSermon(response.data.data),
    };
  },

  delete(id: string) {
    return HTTP.delete(`/sermons/${id}`);
  },
};
