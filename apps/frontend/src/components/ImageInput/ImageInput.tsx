import { useId, useState, ChangeEvent } from 'react';
import styles from './ImageInput.module.css';

interface ImageInputProps {
  name: string;
  initialImageUrl?: string;
  onFileChange?: (file?: File) => void;
}

export const ImageInput = ({ name, initialImageUrl, onFileChange }: ImageInputProps) => {
  const inputId = useId();
  const [preview, setPreview] = useState<string | null>(() => initialImageUrl ?? null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Cria uma URL temporária para mostrar a imagem no navegador
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileChange?.(file);
      return;
    }

    setPreview(initialImageUrl ?? null);
    onFileChange?.(undefined);
  };

  return (
    <div className={styles.container}>
      <label 
        htmlFor={inputId} 
        className={styles.imageCard}
        style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}
      >
        {!preview && <span className={styles.plusIcon}>+</span>}
        
        <input
          type="file"
          id={inputId}
          name={name}
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleImageChange}
        />
      </label>
      <span className={styles.helperText}>Adicionar imagem</span>
    </div>
  );
};