console.log('Loading event');

var aws = require('aws-sdk');
var ddb = new aws.DynamoDB({ params: { TableName: 'SESNotifications' } });

exports.handler = function (event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));

  var SnsPublishTime = event.Records[0].Sns.Timestamp.split('T')[0];
  var SnsTopicArn = event.Records[0].Sns.TopicArn;
  var SESMessage = event.Records[0].Sns.Message;

  SESMessage = JSON.parse(SESMessage);

  var SESMessageType = SESMessage.notificationType;
  var SESMessageId = SESMessage.mail.messageId;
  var SESOriginAddress = SESMessage.mail.source.toString();
  var SESDestinationAddress = SESMessage.mail.destination.toString();
  //var LambdaReceiveTime = SnsPublishTime.format('YYYY/MM/DD');
  var SESSubject = SESMessage.mail.commonHeaders['subject'].toString();
  var pendiente = 'pendiente';

  if (SESMessageType == 'Bounce') {
    var SESreportingMTA = SESMessage.bounce.reportingMTA;
    var SESbounceSummary = JSON.stringify(SESMessage.bounce.bouncedRecipients);
    var itemParams = {
      Item: {
        SESMessageId: { S: SESMessageId },
        SnsPublishTime: { S: SnsPublishTime },
        SESreportingMTA: { S: SESreportingMTA },
        SESOriginAddress: { S: SESOriginAddress },
        SESDestinationAddress: { S: SESDestinationAddress },
        SESSubject: { S: SESSubject },
        SESbounceSummary: { S: SESbounceSummary },
        SESMessageType: { S: SESMessageType },
        SESstatus: { S: pendiente },
      },
    };
    ddb.putItem(itemParams, function (err, data) {
      if (err) {
        callback(err);
      } else {
        console.log(data);
        callback(null, '');
      }
    });
  } else if (SESMessageType == 'Reject') {
    var SESComplaintFeedbackType = SESMessage.complaint.complaintFeedbackType;
    var SESFeedbackId = SESMessage.complaint.feedbackId;
    var itemParamscomp = {
      Item: {
        SESMessageId: { S: SESMessageId },
        SnsPublishTime: { S: SnsPublishTime },
        SESComplaintFeedbackType: { S: SESComplaintFeedbackType },
        SESFeedbackId: { S: SESFeedbackId },
        SESDestinationAddress: { S: SESDestinationAddress },
        SESMessageType: { S: SESMessageType },
      },
    };
    ddb.putItem(itemParamscomp, function (err, data) {
      if (err) {
        callback(err);
      } else {
        console.log(data);
        callback(null, '');
      }
    });
  }
};
