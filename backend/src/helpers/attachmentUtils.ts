import * as aws from 'aws-sdk'
import * as awsxray from 'aws-xray-sdk'

const xaws = awsxray.captureAWS(aws)
// TODO: Implement the fileStogare logic

export class TodoAttachmentUtils {
    constructor(
        private readonly s3 = new xaws.S3({ signatureVersion: 'v4' }),
        private readonly s3bucket = process.env.S3_BUCKET_NAME,
        private readonly signedURLExpiration = process.env.SIGNED_URL_EXPIRATION
    ) { }

    async getSignedUrl(bucketKey: string): Promise<string> {
        return this.s3.getSignedUrl('putObject', {
          Bucket: this.s3bucket,
          Key: bucketKey,
          Expires: this.signedURLExpiration
        })
    }

    async deleteTodoItemAttachment(bucketKey: string): Promise<void> {
        await this.s3.deleteObject({
            Bucket: this.s3bucket,
            Key: bucketKey,
        }).promise()
    }

}