export interface AudioInput {
    id: string;
    userId: string;
    filePath: string;
    description: string;
}

export interface AccompanimentOutput {
    id: string;
    audioFilePath: string;
    style: string;
    generatedAt: Date;
}