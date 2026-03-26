-- =============================================
-- MIGRATION 002: Add editable content blocks for
--   Tokyo Summit live sections + both form texts
-- Safe to run multiple times (NOT EXISTS guards)
-- Run this on your Supabase SQL editor
-- =============================================


-- ============================================================
-- TOKYO SUMMIT 2026 — About The Summit
-- ============================================================

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'about', 'title',
    'ABOUT THE <span>SUMMIT</span>',
    'サミット<span>について</span>',
    '서밋 <span>소개</span>',
    'html', 10
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'about' AND cb.block_key = 'title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'about', 'description',
    'Tokyo Summit 2026 is the premier gathering for football industry leaders, club executives, marketing professionals, and digital innovators from Europe and Asia. Join us for three days of networking, insights, and strategic discussions on the future of football business in the Asian market.',
    'Tokyo Summit 2026は、ヨーロッパとアジアのサッカー業界リーダー、クラブ幹部、マーケティング専門家、デジタルイノベーターのための最高峰の集会です。アジア市場のサッカービジネスの未来について、3日間のネットワーキング、インサイト、戦略的議論にご参加ください。',
    'Tokyo Summit 2026는 유럽과 아시아의 축구 산업 리더, 클럽 임원, 마케팅 전문가, 디지털 혁신가를 위한 최고의 모임입니다. 아시아 시장 축구 비즈니스의 미래에 대한 3일간의 네트워킹, 인사이트, 전략적 논의에 참여하세요.',
    'text', 20
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'about' AND cb.block_key = 'description');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'about', 'card1_title', 'Networking Opportunities', 'ネットワーキングの機会', '네트워킹 기회', 'text', 30
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'about' AND cb.block_key = 'card1_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'about', 'card1_desc',
    'Connect with 500+ senior executives from top European clubs and Asian football organizations in dedicated networking sessions.',
    'トップヨーロッパクラブとアジアのサッカー組織の500人以上の上級幹部とつながります。',
    '유럽 최고 클럽과 아시아 축구 조직의 500명 이상의 임원과 교류하세요.',
    'text', 40
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'about' AND cb.block_key = 'card1_desc');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'about', 'card2_title', 'Market Insights', '市場インサイト', '시장 인사이트', 'text', 50
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'about' AND cb.block_key = 'card2_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'about', 'card2_desc',
    'Gain exclusive insights into Asian football markets, fan behavior, and commercial opportunities from industry experts.',
    '業界専門家からアジアのサッカー市場、ファン行動、商業機会に関する独自の洞察を得ます。',
    '업계 전문가로부터 아시아 축구 시장, 팬 행동, 상업적 기회에 대한 독점적 인사이트를 얻으세요.',
    'text', 60
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'about' AND cb.block_key = 'card2_desc');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'about', 'card3_title', 'Expert Speakers', '専門スピーカー', '전문 연사', 'text', 70
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'about' AND cb.block_key = 'card3_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'about', 'card3_desc',
    'Learn from 50+ influential speakers including club presidents, marketing directors, and digital strategy leaders.',
    'クラブ会長、マーケティングディレクター、デジタル戦略リーダーを含む50人以上の有力スピーカーから学びます。',
    '클럽 회장, 마케팅 디렉터, 디지털 전략 리더 등 50명 이상의 영향력 있는 연사에게 배우세요.',
    'text', 80
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'about' AND cb.block_key = 'card3_desc');


-- ============================================================
-- TOKYO SUMMIT 2026 — Summit Objectives
-- ============================================================

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'objectives', 'title',
    'SUMMIT <span>OBJECTIVES</span>',
    'サミットの<span>目標</span>',
    '서밋 <span>목표</span>',
    'html', 10
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'objectives' AND cb.block_key = 'title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'objectives', 'item1_title', 'Bridge European & Asian Football', 'ヨーロッパとアジアのサッカーを繋ぐ', '유럽과 아시아 축구를 연결', 'text', 20
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'objectives' AND cb.block_key = 'item1_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'objectives', 'item1_desc',
    'Create meaningful connections between European football clubs and Asian markets, fostering mutual understanding and collaboration across continents.',
    'ヨーロッパのサッカークラブとアジア市場の間に有意義なつながりを作り、大陸を越えた相互理解と協力を育みます。',
    '유럽 축구 클럽과 아시아 시장 간의 의미 있는 연결을 만들고 대륙을 초월한 상호 이해와 협력을 증진합니다.',
    'text', 30
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'objectives' AND cb.block_key = 'item1_desc');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'objectives', 'item2_title', 'Share Market Intelligence', '市場インテリジェンスの共有', '시장 인텔리전스 공유', 'text', 40
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'objectives' AND cb.block_key = 'item2_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'objectives', 'item2_desc',
    'Provide deep insights into Asian football markets, fan culture, digital consumption patterns, and commercial opportunities for European clubs.',
    'アジアのサッカー市場、ファン文化、デジタル消費パターン、ヨーロッパクラブの商業機会に関する深い洞察を提供します。',
    '아시아 축구 시장, 팬 문화, 디지털 소비 패턴, 유럽 클럽을 위한 상업적 기회에 대한 깊은 인사이트를 제공합니다.',
    'text', 50
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'objectives' AND cb.block_key = 'item2_desc');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'objectives', 'item3_title', 'Foster Strategic Partnerships', '戦略的パートナーシップの育成', '전략적 파트너십 육성', 'text', 60
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'objectives' AND cb.block_key = 'item3_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'objectives', 'item3_desc',
    'Facilitate B2B meetings and networking opportunities that lead to concrete partnerships, sponsorships, and collaborative projects.',
    'B2Bミーティングとネットワーキングの機会を促進し、具体的なパートナーシップ、スポンサーシップ、共同プロジェクトにつなげます。',
    'B2B 미팅과 네트워킹 기회를 촉진하여 구체적인 파트너십, 스폰서십, 협업 프로젝트로 이어지게 합니다.',
    'text', 70
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'objectives' AND cb.block_key = 'item3_desc');


-- ============================================================
-- TOKYO SUMMIT 2026 — Who Should Attend
-- ============================================================

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'title',
    'WHO SHOULD <span>ATTEND</span>',
    '参加すべき<span>方</span>',
    '참가 <span>대상</span>',
    'html', 10
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'card1_title', 'Club Executives', 'クラブ幹部', '클럽 임원', 'text', 20
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'card1_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'card1_desc',
    'CEOs, Presidents, and Directors from European football clubs looking to expand into Asian markets and build their international presence.',
    'アジア市場への進出と国際的なプレゼンス構築を目指すヨーロッパサッカークラブのCEO、会長、ディレクター。',
    '아시아 시장 진출과 국제적 입지 강화를 원하는 유럽 축구 클럽의 CEO, 회장, 이사.',
    'text', 30
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'card1_desc');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'card2_title', 'Marketing Directors', 'マーケティングディレクター', '마케팅 디렉터', 'text', 40
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'card2_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'card2_desc',
    'Marketing and commercial leaders responsible for international expansion, brand development, and fan engagement strategies.',
    '国際展開、ブランド開発、ファンエンゲージメント戦略を担当するマーケティング・商業リーダー。',
    '국제 확장, 브랜드 개발, 팬 참여 전략을 담당하는 마케팅 및 상업 리더.',
    'text', 50
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'card2_desc');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'card3_title', 'Digital Strategy Heads', 'デジタル戦略責任者', '디지털 전략 책임자', 'text', 60
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'card3_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'card3_desc',
    'Digital and social media executives focused on content localization, platform strategy, and Asian fan community building.',
    'コンテンツローカライゼーション、プラットフォーム戦略、アジアファンコミュニティ構築に注力するデジタル・ソーシャルメディア幹部。',
    '콘텐츠 현지화, 플랫폼 전략, 아시아 팬 커뮤니티 구축에 집중하는 디지털 및 소셜 미디어 임원.',
    'text', 70
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'card3_desc');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'card4_title', 'Sponsorship Managers', 'スポンサーシップマネージャー', '스폰서십 매니저', 'text', 80
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'card4_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'audience', 'card4_desc',
    'Partnership and sponsorship professionals seeking Asian brand collaborations and commercial opportunities in football.',
    'サッカーにおけるアジアブランドのコラボレーションと商業機会を求めるパートナーシップ・スポンサーシップ専門家。',
    '축구에서 아시아 브랜드 협업과 상업적 기회를 모색하는 파트너십 및 스폰서십 전문가.',
    'text', 90
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'audience' AND cb.block_key = 'card4_desc');


-- ============================================================
-- TOKYO SUMMIT 2026 — Registration Form
-- ============================================================

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'register', 'title', 'REGISTER NOW', '今すぐ登録', '지금 등록', 'text', 10
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'register' AND cb.block_key = 'title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'register', 'description',
    'Secure your spot at Tokyo Summit 2026. Limited seats available for this exclusive football business event.',
    'Tokyo Summit 2026でのあなたの席を確保してください。この独占的なフットボールビジネスイベントの座席は限られています。',
    'Tokyo Summit 2026에서 귀하의 자리를 확보하세요. 이 독점적인 축구 비즈니스 이벤트의 좌석이 제한되어 있습니다.',
    'text', 20
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'register' AND cb.block_key = 'description');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'register', 'submit_btn', 'SUBMIT REGISTRATION', '登録を送信', '등록 제출', 'text', 30
FROM pages p WHERE p.slug = 'tokyo-summit-2026'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'register' AND cb.block_key = 'submit_btn');


-- ============================================================
-- CONTACT PAGE — Form Section
-- ============================================================

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'form', 'header_title', 'CONTACT FORM', 'お問い合わせフォーム', '문의 양식', 'text', 10
FROM pages p WHERE p.slug = 'contact'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'form' AND cb.block_key = 'header_title');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'form', 'description',
    'Fill out the form below and our team will get back to you within 24 hours to discuss how we can help with your football strategy in Asia.',
    '以下のフォームにご記入いただければ、24時間以内にチームがアジアでのフットボール戦略についてご連絡いたします。',
    '아래 양식을 작성하시면 24시간 이내에 아시아 축구 전략에 대해 논의하기 위해 팀이 연락드리겠습니다.',
    'text', 20
FROM pages p WHERE p.slug = 'contact'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'form' AND cb.block_key = 'description');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'form', 'submit_btn', 'SEND MESSAGE', 'メッセージを送る', '메시지 보내기', 'text', 30
FROM pages p WHERE p.slug = 'contact'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'form' AND cb.block_key = 'submit_btn');

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order)
SELECT p.id, 'form', 'footer_note',
    '* Required fields. We typically respond within 24 hours on business days.',
    '* 必須項目。通常、営業日に24時間以内にご連絡いたします。',
    '* 필수 항목. 일반적으로 영업일 기준 24시간 이내에 답변드립니다.',
    'text', 40
FROM pages p WHERE p.slug = 'contact'
AND NOT EXISTS (SELECT 1 FROM content_blocks cb WHERE cb.page_id = p.id AND cb.section = 'form' AND cb.block_key = 'footer_note');
