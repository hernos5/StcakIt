import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/Button';

interface Props {
  onClose: () => void;
}

export const EditProfileModal: React.FC<Props> = ({ onClose }) => {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const avatarUrl = avatarPreview;

    // Optional: Upload to a server instead of using base64
    // If you're using Firebase/Cloudinary, do the upload here and get URL

    updateUser({ name, avatar: avatarUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-background-dark rounded-lg w-full max-w-md p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

        <label className="block text-sm mb-1 font-medium">Name</label>
        <input
          type="text"
          className="input w-full mb-4 border border-gray-300 rounded px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block text-sm mb-1 font-medium">Avatar</label>
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Avatar preview"
            className="w-20 h-20 rounded-full mb-2 object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4"
        />

        <label className="block text-sm mb-1 font-medium">Bio</label>
        <textarea
          className="input w-full mb-4 border border-gray-300 rounded px-3 py-2"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
