export async function registerStudent(payload, photoFile) {
  const formData = new FormData();
  Object.keys(payload).forEach(key => {
    formData.append(key, payload[key]);
  });
  if (photoFile) {
    formData.append('photo', photoFile);
  }

  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/register`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Registration failed');
  }
  return data;
}
