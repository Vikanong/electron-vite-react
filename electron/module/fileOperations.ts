import * as fs from 'fs';
import { dialog } from 'electron'

interface ImageInfo {
    fileName: string;
    filePath: string;
    folderPath: string;
}

export const readImagesFromFolder = (folderPath: string): { fileName: string; filePath: string; }[] => {
    try {
        const imageFiles = fs.readdirSync(folderPath).filter(file => {
            return file.endsWith('.jpg') || file.endsWith('.png');
        });

        return imageFiles.map(file => ({
            fileName: file,
            filePath: `${folderPath}/${file}`,
        }));
    } catch (error) {
        console.error('Error reading images:', error);
        return [];
    }
}

const saveImagesWithNewNames = (imageList: ImageInfo[]): void => {
    try {
        imageList.forEach((image, index) => {
            const newFilePath = `${image.folderPath}/${index + 1}.png`;
            fs.renameSync(image.filePath, newFilePath);
        });
    } catch (error) {
        console.error('Error saving images with new names:', error);
    }
}

// 选择图片文件夹
export const selectFolder = async (win: any) => {
    try {
        const result = await dialog.showOpenDialog(win, {
            properties: ['openFile', 'openDirectory'],
        });

        if (!result.canceled) {
            const selectedFolderPath = result.filePaths[0];

            // 使用文件读取模块读取文件夹中的图片文件
            const imageFiles = readImagesFromFolder(selectedFolderPath);

            return {
                folderPath: selectedFolderPath,
                imageFiles,
            }
        } else {
            console.log('用户取消了选择');
        }
    } catch (error) {
        console.error('选择文件夹时出错:', error);
    }
}