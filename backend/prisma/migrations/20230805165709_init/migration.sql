-- CreateTable
CREATE TABLE "plt_user" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "plt_user_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "plt_loan" (
    "uid" BIGSERIAL NOT NULL,
    "lenderId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "interest" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdBy" TEXT NOT NULL DEFAULT 'lender',

    CONSTRAINT "plt_loan_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "plt_repayment" (
    "uid" BIGSERIAL NOT NULL,
    "loanId" BIGINT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "comments" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "plt_repayment_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "plt_user_email_key" ON "plt_user"("email");

-- AddForeignKey
ALTER TABLE "plt_loan" ADD CONSTRAINT "plt_loan_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "plt_user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plt_loan" ADD CONSTRAINT "plt_loan_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "plt_user"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plt_repayment" ADD CONSTRAINT "plt_repayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "plt_loan"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
