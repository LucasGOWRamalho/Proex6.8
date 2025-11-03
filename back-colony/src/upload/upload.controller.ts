import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    // Validar tipo de arquivo
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.');
    }

    try {
      const result = await this.uploadService.uploadFile(file);
      return {
        message: 'Upload realizado com sucesso',
        imageUrl: result.url,
        publicId: result.publicId,
      };
    } catch (error) {
      throw new BadRequestException('Erro ao fazer upload da imagem');
    }
  }

  @Post('multiple')
  @UseInterceptors(FileInterceptor('files'))
  async uploadMultipleImages(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const uploadResults: { originalName: string; imageUrl: string; publicId: string }[] = [];
    
    for (const file of files) {
      const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedMimes.includes(file.mimetype)) {
        continue; // Pula arquivos inválidos
      }

      try {
        const result = await this.uploadService.uploadFile(file);
        uploadResults.push({
          originalName: file.originalname,
          imageUrl: result.url,
          publicId: result.publicId,
        });
      } catch (error) {
        // Continua com outros arquivos mesmo se um falhar
        console.error(`Erro no upload de ${file.originalname}:`, error);
      }
    }

    return {
      message: 'Uploads realizados com sucesso',
      uploaded: uploadResults,
    };
  }
}