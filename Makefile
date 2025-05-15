.PHONY: build-notifyReminderFunction

build-notifyReminderFunction:
	mkdir -p $(ARTIFACTS_DIR)/src/handlers/
	mkdir -p $(ARTIFACTS_DIR)/src/utils/email/template/
	mkdir -p $(ARTIFACTS_DIR)/node_modules/

	cp src/handlers/send-reminders-cron.js $(ARTIFACTS_DIR)/src/handlers/
	cp src/utils/email/emailService.js $(ARTIFACTS_DIR)/src/utils/
	cp src/utils/email/template/notification.ejs $(ARTIFACTS_DIR)/src/utils/email/template/
	cp package.json $(ARTIFACTS_DIR)/
	cd $(ARTIFACTS_DIR) && npm install --omit=dev
