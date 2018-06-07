# googlepubsub
Publisher and Subscriber for Google Pub/Sub

## This is a basic implementation of Google's Pub/Sub using Node.js
Here are the steps to use it:

1. Clone or Download the source code
2. Create a topic in Google's [Pub/Sub](https://console.cloud.google.com/cloudpubsub/)
3. Create Subscriber for the newly created Topic in Google's [Pub/Sub](https://console.cloud.google.com/cloudpubsub/)
4. Change configuration values in default.json and production.json based on your environment
5. Set Google Application Credentials (GOOGLE_APPLICATION_CREDENTIALS) environment variable
6. Create a Service Account with following Roles:
	1. Pub/Sub Publisher
	2. Pub/Sub Subscriber
	3. Logs Writer
7. Run it using ````npm run local````

This would expose the server on [http://localhost:8090](http://localhost:8090)

## Publish a new Message to the Topic
To Publish a message, POST to the [Topic endpoint](http://localhost:8090/:topic/publish)

## Subscribe to Messages on a Topic's Subscription
To Subscribe for messages, make a GET request to the [Subscribe endpoint](http://localhost:8090/:subscription/subscribe)