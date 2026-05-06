function ImageUploader({ label, currentUrl, onFileChange, disabled }) {
  return (
    <div className="image-uploader">
      <label>
        {label}
        <input
          type="file"
          accept="image/*"
          disabled={disabled}
          onChange={(event) => onFileChange(event.target.files?.[0] || null)}
        />
      </label>
      {currentUrl ? (
        <img src={currentUrl} alt="Prévia da imagem cadastrada" />
      ) : (
        <div className="image-preview-empty">Sem imagem</div>
      )}
    </div>
  )
}

export default ImageUploader
