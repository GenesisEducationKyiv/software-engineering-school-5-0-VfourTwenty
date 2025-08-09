const { expect } = require('chai');
const EmailProviderManager = require('../../src/infrastructure/providers/emailProviderManager');
const { EmailProviderMock1, EmailProviderMock2 } = require('../mocks/emailProviders.mock');
const LoggerMock = require('../mocks/utils/logger.mock');
const MetricsProviderMock = require('../mocks/metrics/metricsProvider.mock');

const loggerMock = new LoggerMock();
const metricsProviderMock = new MetricsProviderMock();
const mockedEmailProviders = [new EmailProviderMock1(), new EmailProviderMock2()];
const emailProviderManager = new EmailProviderManager(mockedEmailProviders, loggerMock, metricsProviderMock);

describe('EmailProviderManager Unit Tests', () => 
{
    it('should return success when the first available provider succeeds', async () => 
    {
        // Act
        const response = await emailProviderManager.sendEmail('email1@mail.com', 'hello', 'hello');

        // Assert
        expect(response.success).to.be.true;
    });

    it('should delegate to the next provider and return success when the first available provider fails', async () => 
    {
        // Act
        const response = await emailProviderManager.sendEmail('email2@mail.com', 'hello', 'hello');

        // Assert
        expect(response.success).to.be.true;
    });
});
