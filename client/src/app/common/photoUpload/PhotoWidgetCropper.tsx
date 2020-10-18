import React, { FC, useRef } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

interface Props {
  setImage: (file: Blob) => void
  imagePreview: string
}

const PhotoWidgetCropper: FC<Props> = ({ setImage, imagePreview }) => {
  const cropperRef = useRef<Cropper>(null)

  const cropImage = () => {
    if (cropperRef.current && typeof cropperRef.current.getCroppedCanvas() === 'undefined') {
      return
    }

    cropperRef?.current?.getCroppedCanvas().toBlob((blob: any) => {
      setImage(blob)
    }, 'image/jpeg')
  }

  return (
    <Cropper
      ref={cropperRef}
      src={imagePreview}
      style={{ height: 200, width: '100%' }}
      aspectRatio={1 / 1}
      preview='.img-preview'
      guides={false}
      viewMode={1}
      dragMode='move'
      scalable={true}
      cropBoxMovable={true}
      cropBoxResizable={true}
      crop={cropImage}
    />
  )
}

export default PhotoWidgetCropper
