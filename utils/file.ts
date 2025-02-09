export default function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = reject;
    reader.onload = () => resolve(reader.result as string);

    reader.readAsDataURL(blob);
  });
}
