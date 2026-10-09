import { HTTP } from "./http";
import type {
  PaginationOptions,
  PaginationResponse,
} from "./interfaces/pagination.interface";
import type { CResponse } from "./interfaces/Response.interface";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  title: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMember {
  name: string;
  email: string;
  title: string;
  photo: File;
}

export type UpdateTeamMember = Partial<Omit<CreateTeamMember, "photo">> & {
  photo?: File;
};

const toFormData = (data: CreateTeamMember | UpdateTeamMember) => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append("name", data.name);
  if (data.email !== undefined) formData.append("email", data.email);
  if (data.title !== undefined) formData.append("title", data.title);
  if (data.photo) formData.append("photo", data.photo);
  return formData;
};

const getImageUrl = (imageUrl: string) => {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl

  const baseUrl = HTTP.defaults.baseURL
  return baseUrl ? `${baseUrl.replace(/\/$/, '')}${imageUrl}` : imageUrl
}

const normalizeTeamMember = (member: TeamMember): TeamMember => ({
  ...member,
  photo: getImageUrl(member.photo),
});

export const TeamMembersService = {
  async getAll(
    params: PaginationOptions,
  ): Promise<PaginationResponse<TeamMember>> {
    const response = await HTTP.get<PaginationResponse<TeamMember>>(
      "/team-members",
      { params },
    );
    return {
      ...response.data,
      data: {
        ...response.data.data,
        items: response.data.data.items.map(normalizeTeamMember),
      },
    };
  },

  async getById(id: string): Promise<CResponse<TeamMember>> {
    const response = await HTTP.get<CResponse<TeamMember>>(
      `/team-members/${id}`,
    );
    return {
      ...response.data,
      data: normalizeTeamMember(response.data.data),
    };
  },

  async create(data: CreateTeamMember): Promise<CResponse<TeamMember>> {
    const response = await HTTP.post<CResponse<TeamMember>>(
      "/team-members",
      toFormData(data),
    );
    return {
      ...response.data,
      data: normalizeTeamMember(response.data.data),
    };
  },

  async update(
    id: string,
    data: UpdateTeamMember,
  ): Promise<CResponse<TeamMember>> {
    const response = await HTTP.patch<CResponse<TeamMember>>(
      `/team-members/${id}`,
      toFormData(data),
    );
    return {
      ...response.data,
      data: normalizeTeamMember(response.data.data),
    };
  },

  delete(id: string) {
    return HTTP.delete(`/team-members/${id}`);
  },
};