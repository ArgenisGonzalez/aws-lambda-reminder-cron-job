// @ts-ignore
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
// @ts-ignore
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import reminderEmailService from "../utils/emailService.js";
const client = new DynamoDBClient({
  region: "us-east-1",
  endpoint: "http://host.docker.internal:8000",
});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.REMINDER_TABLE;

console.log("tableName", tableName);

const senderEmail = process.env.SENDER_EMAIL;
const receiverEmail = process.env.RECEIVER_EMAIL;

console.log("sender", senderEmail, "receiver", receiverEmail);

// @ts-ignore
export const notifyReminderHandler = async (event) => {
  console.info("⏰ Checking reminders...");

  const now = Date.now();

  const params = {
    TableName: tableName,
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));
    const items = data.Items || [];

    const dueReminders = items.filter((item) => {
      const eventTime = parseInt(item.eventTime?.N || 0, 10);
      return eventTime <= now;
    });

    if (dueReminders.length === 0) {
      console.log("✅ No reminders due at this time.");
    } else {
      for (const reminder of dueReminders) {
        console.log(
          `📬 Sending reminder to ${receiverEmail}: "${reminder.description}" scheduled at ${reminder.eventTime}`
        );

        await reminderEmailService.sendReminder(
          receiverEmail,
          reminder.description?.S,
          `${reminder.duration?.N} minutes`
        );
      }
    }
  } catch (err) {
    console.error("❌ Error checking reminders", err);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Reminder check completed." }),
  };
};
