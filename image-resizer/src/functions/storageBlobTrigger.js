// const { app } = require('@azure/functions');

// app.storageBlob('storageBlobTrigger', {
//     path: 'samples-workitems/{name}',
//     connection: '',
//     handler: (blob, context) => {
//         context.log(`Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`);
//     }
// });

const { app } = require('@azure/functions');
const sharp = require('sharp');

app.storageBlob('storageBlobTrigger', {
    path: 'uploads/{name}',
    connection: 'AzureWebJobsStorage',
    handler: async (blob, context) => {
        const fileName = context.triggerMetadata.name;
        context.log(`Processing file: ${fileName}`);

        try {
            const resizedImage = await sharp(blob)
                .resize(200, 200)
                .toBuffer();

            // Write to output container
            const outputBlob = context.extraOutputs.get('outputBlob');
            outputBlob.set(resizedImage);

            context.log(`Resized image saved: ${fileName}`);
        } catch (error) {
            context.log.error("Error processing image:", error);
        }
    },
    extraOutputs: [
        {
            name: 'outputBlob',
            type: 'blob',
            path: 'thumbnails/{name}',
            connection: 'AzureWebJobsStorage'
        }
    ]
});
