export function normalizeAudio(audioBuffer: AudioBuffer): AudioBuffer {
    const channelData = audioBuffer.getChannelData(0);
    const max = Math.max(...channelData);
    const min = Math.min(...channelData);
    const range = max - min;

    const normalizedData = channelData.map(sample => (sample - min) / range);
    const normalizedAudioBuffer = new AudioBuffer({
        length: audioBuffer.length,
        numberOfChannels: audioBuffer.numberOfChannels,
        sampleRate: audioBuffer.sampleRate
    });

    for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        normalizedAudioBuffer.copyToChannel(normalizedData, i);
    }

    return normalizedAudioBuffer;
}

export function extractFeatures(audioBuffer: AudioBuffer): number[] {
    const features: number[] = [];
    const channelData = audioBuffer.getChannelData(0);

    // Example feature extraction: calculate the average amplitude
    const averageAmplitude = channelData.reduce((sum, sample) => sum + Math.abs(sample), 0) / channelData.length;
    features.push(averageAmplitude);

    // Additional feature extraction logic can be added here

    return features;
}