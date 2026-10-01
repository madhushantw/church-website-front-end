import { HTTP } from "./http";
import type {
  PaginationOptions,
  PaginationResponse,
} from "./interfaces/pagination.interface";
import type { CResponse } from "./interfaces/Response.interface";

export interface MissionPartner {
  id: string;
  type: string;
  title: string;
  description: string | null;
  link: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMissionPartner {
  type: string;
  title: string;
  description: string;
  link: string;
}

export type UpdateMissionPartner = Partial<CreateMissionPartner>;

export const MissionPartnersService = {
  async getAll(
    params: PaginationOptions,
  ): Promise<PaginationResponse<MissionPartner>> {
    const response = await HTTP.get<PaginationResponse<MissionPartner>>(
      "/mission-partners",
      { params },
    );

    return response.data;
  },

  async getById(id: string): Promise<CResponse<MissionPartner>> {
    const response = await HTTP.get<CResponse<MissionPartner>>(
      `/mission-partners/${id}`,
    );
    return response.data;
  },

  async create(
    data: CreateMissionPartner,
  ): Promise<CResponse<MissionPartner>> {
    const response = await HTTP.post<CResponse<MissionPartner>>(
      "/mission-partners",
      data,
    );
    return response.data;
  },

  async update(
    id: string,
    data: UpdateMissionPartner,
  ): Promise<CResponse<MissionPartner>> {
    const response = await HTTP.patch<CResponse<MissionPartner>>(
      `/mission-partners/${id}`,
      data,
    );
    return response.data;
  },

  delete(id: string) {
    return HTTP.delete(`/mission-partners/${id}`);
  },
};