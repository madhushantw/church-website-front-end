import type { CResponse } from "~/services/interfaces/Response.interface";
import { HTTP } from "./http";
import type {
  PaginationOptions,
  PaginationResponse,
} from "./interfaces/pagination.interface";

export interface CreateContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const ContactService = {
  async getAll(params: PaginationOptions) {
    const response = await HTTP.get<PaginationResponse<ContactItem>>(
      "/contact",
      {
        params,
      },
    );

    return response.data;
  },

  async markAsRead(id: string): Promise<CResponse<ContactItem>> {
    const response = await HTTP.patch<CResponse<ContactItem>>(
      `/contact/${id}/read`,
    );

    return response.data;
  },

  async create(data: CreateContactRequest): Promise<CResponse<ContactItem>> {
    const response = await HTTP.post<CResponse<ContactItem>>("/contact", data);

    return response.data;
  },

  async delete(id: string) {
    return HTTP.delete(`/contact/${id}`);
  },
};
