// ----------------------------------------------------------------

const BASE_API_URL = 'http://localhost:8080/api';

export const joinGroup = async (groupId: string, userId: string) => {
  const response = await fetch(BASE_API_URL + `/groups/${groupId}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      viewerId: userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  return response.json();
};

export const leaveGroup = async (groupId: string, userId: string) => {
  const response = await fetch(BASE_API_URL + `/groups/${groupId}/leave`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      viewerId: userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  return response.json();
};

export const removeMemberFromGroup = async (
  groupId: string,
  viewerId: string,
  userId: string
) => {
  const response = await fetch(BASE_API_URL + `/groups/${groupId}/user`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      viewerId,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  return response.json();
};

export const assignAdminRole = async (
  groupId: string,
  viewerId: string,
  userId: string
) => {
  const response = await fetch(BASE_API_URL + `/groups/${groupId}/admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      viewerId,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  return response.json();
};

export const removeAdminRole = async (
  groupId: string,
  viewerId: string,
  userId: string
) => {
  const response = await fetch(BASE_API_URL + `/groups/${groupId}/admin`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      viewerId,
      userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Something went wrong!');
  }

  return response.json();
};
