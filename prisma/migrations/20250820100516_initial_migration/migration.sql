-- CreateTable
CREATE TABLE "public"."message_parts" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "toolCallId" TEXT,
    "toolName" TEXT,
    "args" JSONB,
    "result" JSONB,
    "status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "messagePartId" TEXT NOT NULL,
    "providerMetadata" JSONB,

    CONSTRAINT "message_parts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "byok" BOOLEAN NOT NULL DEFAULT false,
    "resumableStreamId" TEXT,
    "tokens" INTEGER,
    "tokensPerSecond" DOUBLE PRECISION,
    "timeToFirstToken" DOUBLE PRECISION,
    "attachments" JSONB NOT NULL DEFAULT '[]',
    "providerMetadata" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "description" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "supportFile" BOOLEAN NOT NULL DEFAULT false,
    "supportImage" BOOLEAN NOT NULL DEFAULT false,
    "supportWebSearch" BOOLEAN NOT NULL DEFAULT false,
    "supportReasoning" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "freeModel" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."threads" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Thread',
    "model" TEXT,
    "generationStatus" TEXT NOT NULL DEFAULT 'pending',
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "status" TEXT NOT NULL DEFAULT 'active',
    "pinned" BOOLEAN NOT NULL DEFAULT false,
    "userSetTitle" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'free',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_parts_messagePartId_key" ON "public"."message_parts"("messagePartId");

-- CreateIndex
CREATE INDEX "message_parts_messageId_idx" ON "public"."message_parts"("messageId");

-- CreateIndex
CREATE INDEX "message_parts_type_idx" ON "public"."message_parts"("type");

-- CreateIndex
CREATE UNIQUE INDEX "messages_messageId_key" ON "public"."messages"("messageId");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "public"."messages"("createdAt");

-- CreateIndex
CREATE INDEX "messages_threadId_idx" ON "public"."messages"("threadId");

-- CreateIndex
CREATE UNIQUE INDEX "models_modelId_key" ON "public"."models"("modelId");

-- CreateIndex
CREATE INDEX "models_createdAt_idx" ON "public"."models"("createdAt");

-- CreateIndex
CREATE INDEX "models_modelId_idx" ON "public"."models"("modelId");

-- CreateIndex
CREATE INDEX "models_name_idx" ON "public"."models"("name");

-- CreateIndex
CREATE UNIQUE INDEX "threads_threadId_key" ON "public"."threads"("threadId");

-- CreateIndex
CREATE INDEX "threads_createdAt_idx" ON "public"."threads"("createdAt");

-- CreateIndex
CREATE INDEX "threads_threadId_idx" ON "public"."threads"("threadId");

-- CreateIndex
CREATE INDEX "threads_title_idx" ON "public"."threads"("title");

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "public"."users"("clerkId");

-- CreateIndex
CREATE INDEX "users_clerkId_idx" ON "public"."users"("clerkId");

-- AddForeignKey
ALTER TABLE "public"."message_parts" ADD CONSTRAINT "message_parts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."messages"("messageId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "messages_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "public"."threads"("threadId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."threads" ADD CONSTRAINT "threads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("clerkId") ON DELETE CASCADE ON UPDATE CASCADE;
