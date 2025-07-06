import {
  Controller,
  Post,
  UploadedFiles,
  UploadedFile,
  UseInterceptors,
  UseFilters,
  Body,
  Delete,
  Param,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { HttpExceptionFilter } from 'src/core/http-exception.filter';
import { ApiConsumes, ApiBody, ApiTags, ApiHeader } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';
import path, { join } from 'path';
import fs from 'fs';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('uploads')
  @ResponseMessage('Upload Single or Multiple Files')
  @UseInterceptors(FilesInterceptor('files', 10))
  @UseFilters(new HttpExceptionFilter())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiHeader({
    name: 'folder_type',
    required: false,
    description: 'Custom header',
  })
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (Array.isArray(files)) {
      return files.map((file) => ({ fileName: file.filename }));
    }
    return { message: 'No files uploaded' };
  }

  @Post('upload')
  @ResponseMessage('Upload Single File')
  @UseInterceptors(FileInterceptor('fileUpload'))
  @UseFilters(new HttpExceptionFilter())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fileUpload: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiHeader({
    name: 'folder_type',
    required: false,
    description: 'Custom header',
  })
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      fileName: file.filename,
    };
  }

  @Delete('delete/:folderName/:fileName')
  @ResponseMessage('Delete File from Folder')
  @UseFilters(new HttpExceptionFilter())
  async deleteFileFromFolder(@Param('folderName') folderName: string, @Param('fileName') fileName: string) {
    const folderPath = path.join(process.cwd(), 'public/images', folderName);
    const filePath = path.join(folderPath, fileName);
    
    try {
      // Kiểm tra nếu thư mục tồn tại
      if (fs.existsSync(folderPath)) {
        // Kiểm tra nếu file tồn tại trong thư mục
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`File ${fileName} deleted successfully.`);
        
          const filesInFolder = fs.readdirSync(folderPath);
          
          // Nếu thư mục trống, xóa thư mục
          if (filesInFolder.length === 0) {
            fs.rmdirSync(folderPath);
            console.log(`Folder ${folderName} deleted successfully as it is empty.`);
            return { message: 'File deleted and folder is empty, deleted successfully.' };
          } else {
            return { message: `File ${fileName} deleted successfully, folder still contains other files.` };
          }
        } else {
          return { message: `File ${fileName} not found in the folder.` };
        }
      } else {
        return { message: `Folder ${folderName} not found.` };
      }
    } catch (error) {
      console.error('Error while deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }
}
