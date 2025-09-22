import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();

  const adminPassword = await bcrypt.hash('admin1234', 10);
  const userPassword = await bcrypt.hash('user1234', 10);

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: '관리자',
      password: adminPassword,
      isAdmin: true,
    },
  });

  await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: '일반유저',
      password: userPassword,
      // isAdmin: false,
    },
  });

  await prisma.stylist.create({
    data: {
      email: 'stylist@example.com',
      name: '김스타일',
      password: stylistPassword,
      introduction:
        '10년 경력의 전문 스타일리스트입니다. 개인의 매력을 최대한 끌어내는 스타일링을 제안합니다.',
      specialtyStyles: ['CLASSIC', 'FORMAL', 'CASUAL'],
      career: [
        '서울대학교 의류학과 졸업',
        'Vogue Korea 스타일리스트 3년',
        '현대백화점 VIP 스타일리스트 5년',
        '개인 스타일링 스튜디오 운영 2년',
      ],
      isVerified: true,
      rating: 4.8,
      reviewCount: 127,
    },
  });

  await prisma.stylist.create({
    data: {
      email: 'stylist2@example.com',
      name: '이패션',
      password: stylistPassword,
      introduction:
        '트렌디한 스타일을 추구하는 젊은 스타일리스트입니다. MZ세대의 감성을 잘 이해합니다.',
      specialtyStyles: ['STREET', 'CASUAL', 'MINIMAL'],
      career: [
        '홍익대학교 디자인학과 졸업',
        'Elle Magazine 인턴',
        '온라인 패션 브랜드 스타일링 디렉터 3년',
        'SNS 인플루언서 스타일링 전문',
      ],
      isVerified: true,
      rating: 4.6,
      reviewCount: 89,
    },
  });

  console.log('Seeding Done');
  await prisma.$disconnect();
}

main().catch(console.error);
