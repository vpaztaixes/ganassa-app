-- =============================================
-- GANASSA SEED DATA
-- Run AFTER schema.sql
-- =============================================

-- =============================================
-- ADMIN USER (password: ganassa2026 — CHANGE IN PRODUCTION!)
-- =============================================
INSERT INTO admin_users (email, password_hash, name) VALUES
('admin@ganassa.jp', '$2a$12$LJ3m4ys7Kf5SXoJZJ4VBFeDYkFkHqwZ7Mx3xVqxz1eBGmPyRtGCi', 'Admin');

-- =============================================
-- PAGES
-- =============================================
INSERT INTO pages (slug, status, show_in_nav, nav_order, nav_label_en, nav_label_ja, nav_label_ko, nav_class) VALUES
('home',              'live', true,  1, 'About Us',            'About Us',          'About Us',          ''),
('services',          'live', true,  2, 'Our Services',        'Our Services',      'Our Services',      ''),
('clients',           'live', true,  3, 'Our Clients',         'Our Clients',       'Our Clients',       ''),
('team',              'live', true,  4, 'Our Team',            'Our Team',          'Our Team',          ''),
('partners',          'live', true,  5, 'Partners',            'Partners',          'Partners',          ''),
('tokyo-summit-2026', 'coming_soon', true, 6, 'TOKYO SUMMIT 2026', 'TOKYO SUMMIT 2026', 'TOKYO SUMMIT 2026', 'tokyo-summit'),
('contact',           'live', false, 99, 'Contact Us',         'Contact Us',        'Contact Us',        '');

-- =============================================
-- SEO METADATA
-- =============================================
INSERT INTO seo_metadata (page_id, lang, title, description, og_title, og_description) VALUES
(1, 'en', 'GANASSA | Football Solutions Across Asia', 'Bridging European football with Asian digital culture. We help clubs, leagues and partners grow in Asia.', 'GANASSA | Football Solutions Across Asia', 'Bridging European football with Asian digital culture.'),
(1, 'ja', 'GANASSA | アジア全域のフットボールソリューション', 'ヨーロッパサッカーとアジアのデジタル文化を結びます。', 'GANASSA | アジア全域のフットボールソリューション', 'ヨーロッパサッカーとアジアのデジタル文化を結びます。'),
(1, 'ko', 'GANASSA | 아시아 전역 축구 솔루션', '유럽 축구와 아시아 디지털 문화를 연결합니다.', 'GANASSA | 아시아 전역 축구 솔루션', '유럽 축구와 아시아 디지털 문화를 연결합니다.'),

(2, 'en', 'Our Services | GANASSA', 'Digital strategy, social media management, brand activation and content production for football in Asia.', 'Our Services | GANASSA', 'Digital strategy, social media management, brand activation and content production.'),
(2, 'ja', 'サービス | GANASSA', 'アジアのサッカーに向けたデジタル戦略、ソーシャルメディア管理、ブランドアクティベーション。', 'サービス | GANASSA', 'デジタル戦略、ソーシャルメディア管理、ブランドアクティベーション。'),
(2, 'ko', '서비스 | GANASSA', '아시아 축구를 위한 디지털 전략, 소셜 미디어 관리, 브랜드 활성화.', '서비스 | GANASSA', '디지털 전략, 소셜 미디어 관리, 브랜드 활성화.'),

(3, 'en', 'Our Clients | GANASSA', 'Trusted by leading football clubs, leagues and federations across Europe and Asia.', 'Our Clients | GANASSA', 'Trusted by leading football clubs and leagues.'),
(3, 'ja', 'クライアント | GANASSA', 'ヨーロッパとアジアの主要なサッカークラブ、リーグに信頼されています。', 'クライアント | GANASSA', '主要なサッカークラブとリーグに信頼されています。'),
(3, 'ko', '클라이언트 | GANASSA', '유럽과 아시아의 주요 축구 클럽과 리그의 신뢰를 받고 있습니다.', '클라이언트 | GANASSA', '주요 축구 클럽과 리그의 신뢰를 받고 있습니다.'),

(4, 'en', 'Our Team | GANASSA', 'Meet our international team of sports industry experts based across Asia.', 'Our Team | GANASSA', 'Meet our international team of sports industry experts.'),
(4, 'ja', 'チーム | GANASSA', 'アジア全域を拠点とするスポーツ業界の専門家チームをご紹介します。', 'チーム | GANASSA', 'スポーツ業界の専門家チームをご紹介します。'),
(4, 'ko', '팀 | GANASSA', '아시아 전역에 기반한 스포츠 산업 전문가 팀을 소개합니다.', '팀 | GANASSA', '스포츠 산업 전문가 팀을 소개합니다.'),

(5, 'en', 'Partners | GANASSA', 'Our network of media platforms, technology providers and strategic partners across Asia.', 'Partners | GANASSA', 'Our network of strategic partners across Asia.'),
(5, 'ja', 'パートナー | GANASSA', 'アジア全域のメディアプラットフォーム、テクノロジーパートナー。', 'パートナー | GANASSA', 'アジア全域の戦略的パートナー。'),
(5, 'ko', '파트너 | GANASSA', '아시아 전역의 미디어 플랫폼, 기술 파트너.', '파트너 | GANASSA', '아시아 전역의 전략적 파트너.'),

(6, 'en', 'Tokyo Summit 2026 | GANASSA', 'The premier football business event connecting Europe and Asia. Tokyo, 2026.', 'Tokyo Summit 2026 | GANASSA', 'The premier football business event connecting Europe and Asia.'),
(6, 'ja', 'Tokyo Summit 2026 | GANASSA', 'ヨーロッパとアジアを結ぶプレミアフットボールビジネスイベント。東京、2026年。', 'Tokyo Summit 2026 | GANASSA', 'ヨーロッパとアジアを結ぶプレミアイベント。'),
(6, 'ko', 'Tokyo Summit 2026 | GANASSA', '유럽과 아시아를 연결하는 프리미어 축구 비즈니스 이벤트. 도쿄, 2026.', 'Tokyo Summit 2026 | GANASSA', '유럽과 아시아를 연결하는 프리미어 이벤트.'),

(7, 'en', 'Contact Us | GANASSA', 'Get in touch with our team. Offices in Tokyo, Singapore, Shanghai and Madrid.', 'Contact Us | GANASSA', 'Get in touch with our team across Asia.'),
(7, 'ja', 'お問い合わせ | GANASSA', '私たちのチームにお問い合わせください。東京、シンガポール、上海、マドリードにオフィスがあります。', 'お問い合わせ | GANASSA', 'アジア全域のチームにお問い合わせください。'),
(7, 'ko', '문의하기 | GANASSA', '저희 팀에 연락해 주세요. 도쿄, 싱가포르, 상하이, 마드리드에 사무실이 있습니다.', '문의하기 | GANASSA', '아시아 전역의 팀에 문의해 주세요.');

-- =============================================
-- CONTENT BLOCKS — HOME
-- =============================================
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(1, 'hero', 'title',             'BRIDGING THE<br><span>FOOTBALL WORLD</span> WITH ASIA', 'アジアと<br><span>サッカー界</span>をつなぐ', '아시아와 <br><span>축구 세계</span>를 연결하다', 'html', 1),
(1, 'hero', 'subtitle',          'We are a dynamic team of sports industry experts delivering tailored football solutions across Asia, helping clubs, leagues, and partners grow their presence, engagement, and impact in the region.', 'アジア全域でカスタマイズされたフットボールソリューションを提供するスポーツ業界の専門家チームです。', '아시아 전역에서 맞춤형 축구 솔루션을 제공하는 스포츠 산업 전문가 팀입니다.', 'text', 2),
(1, 'hero', 'cta_primary_text',  'Explore Our Solutions', 'ソリューションを見る', '솔루션 보기', 'text', 3),
(1, 'hero', 'cta_secondary_text','Schedule a Call', '相談する', '상담 신청', 'text', 4),
(1, 'stats', 'years_number',     '10+', '10+', '10+', 'text', 1),
(1, 'stats', 'years_label',      'Years of Experience', '年の経験', '년의 경험', 'text', 2),
(1, 'stats', 'clients_number',   '20+', '20+', '20+', 'text', 3),
(1, 'stats', 'clients_label',    'Clients that Trust Us', '信頼してくださるクライアント', '우리를 신뢰하는 클라이언트', 'text', 4),
(1, 'stats', 'markets_number',   '5+', '5+', '5+', 'text', 5),
(1, 'stats', 'markets_label',    'Asian Markets', 'アジアの市場', '아시아 시장', 'text', 6),
(1, 'expertise', 'title',        'Our Expertise', '私たちの専門分野', '우리의 전문 분야', 'text', 1),
(1, 'expertise', 'subtitle',     'Specialized services that connect and bring European football excellence closer to Asian audiences through digital engagement, live experiences and more.', 'デジタルエンゲージメント、ライブ体験などを通じて、ヨーロッパのサッカーの卓越性をアジアの観客に近づける専門サービス。', '디지털 참여, 라이브 경험 등을 통해 유럽 축구의 우수성을 아시아 관객에게 전달하는 전문 서비스.', 'text', 2),
(1, 'expertise', 'card_1_title', 'Social Media & Digital', 'ソーシャルメディア＆デジタル', '소셜 미디어 & 디지털', 'text', 3),
(1, 'expertise', 'card_1_desc',  'Tailored content strategies that resonate with local Asian fans on platforms like X, Instagram, TikTok, SportsNavi, Line, KakaoTalk, and Naver.', 'X、Instagram、TikTok、SportsNavi、Line、KakaoTalk、Naverなどのプラットフォームでアジアのファンに響くコンテンツ戦略。', 'X, Instagram, TikTok, SportsNavi, Line, KakaoTalk, Naver 등의 플랫폼에서 아시아 팬들에게 공감되는 콘텐츠 전략.', 'text', 4),
(1, 'expertise', 'card_2_title', 'Brand Activation', 'ブランドアクティベーション', '브랜드 활성화', 'text', 5),
(1, 'expertise', 'card_2_desc',  'Connecting global football brands with local culture through impactful digital campaigns, experiential events, activations and strategic partnerships across key Asian markets.', 'デジタルキャンペーン、体験型イベント、アクティベーション、戦略的パートナーシップを通じて、グローバルサッカーブランドと地域文化をつなぐ。', '디지털 캠페인, 체험 이벤트, 활성화, 전략적 파트너십을 통해 글로벌 축구 브랜드와 현지 문화를 연결.', 'text', 6),
(1, 'expertise', 'card_3_title', 'Content Production', 'コンテンツプロダクション', '콘텐츠 제작', 'text', 7),
(1, 'expertise', 'card_3_desc',  'High-quality video and graphic production that maintains brand integrity while engaging local audiences with authentic storytelling and premium visual content.', 'ブランドの整合性を保ちながら、本物のストーリーテリングとプレミアムビジュアルコンテンツで地元の視聴者を引き付ける高品質のビデオとグラフィック制作。', '브랜드 무결성을 유지하면서 진정성 있는 스토리텔링과 프리미엄 비주얼 콘텐츠로 현지 관객을 사로잡는 고품질 비디오 및 그래픽 제작.', 'text', 8),
(1, 'photo_showcase', 'title',       'Global Reach, Local Impact', 'グローバルリーチ、ローカルインパクト', '글로벌 리치, 로컬 임팩트', 'text', 1),
(1, 'photo_showcase', 'description', 'Our international team connects European football brands with Asian fans through innovative digital strategies and culturally relevant activations.', '国際的なチームが革新的なデジタル戦略と文化的に関連するアクティベーションを通じて、ヨーロッパのサッカーブランドとアジアのファンをつなぎます。', '국제적인 팀이 혁신적인 디지털 전략과 문화적으로 관련된 활성화를 통해 유럽 축구 브랜드와 아시아 팬을 연결합니다.', 'text', 2),
(1, 'partners_section', 'title',    'Our Partners', 'パートナー', '파트너', 'text', 1),
(1, 'partners_section', 'subtitle', 'Collaborating with leading platforms and networks across Asia', 'アジア全域の主要プラットフォームやネットワークとの連携', '아시아 전역의 주요 플랫폼 및 네트워크와의 협력', 'text', 2);

-- =============================================
-- CONTENT BLOCKS — SERVICES
-- =============================================
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(2, 'hero', 'title',    'Building football communities<br><span>across continents</span>', 'サッカーコミュニティを<br><span>大陸を越えて</span>構築する', '축구 커뮤니티를<br><span>대륙을 넘어</span> 구축하다', 'html', 1),
(2, 'hero', 'subtitle', 'We provide 360-degree support to top football clubs, leagues, and federations to engage Asian audiences, driving local sponsorships and revenue.', 'トップサッカークラブ、リーグ、連盟にアジアの観客を引き付ける360度のサポートを提供します。', '아시아 관객을 사로잡기 위해 최고의 축구 클럽, 리그, 연맹에 360도 지원을 제공합니다.', 'text', 2),
(2, 'hero', 'stat_1_number', '15+', '15+', '15+', 'text', 3),
(2, 'hero', 'stat_1_label',  'European Football Clubs', 'ヨーロッパフットボールクラブ', '유럽 축구 클럽', 'text', 4),
(2, 'hero', 'stat_2_number', '25+', '25+', '25+', 'text', 5),
(2, 'hero', 'stat_2_label',  'Social Media Editors', 'ソーシャルメディアエディター', '소셜 미디어 편집자', 'text', 6),
(2, 'hero', 'stat_3_number', '8M+', '8M+', '8M+', 'text', 7),
(2, 'hero', 'stat_3_label',  'Asian Fans Reached', 'アジアのファンにリーチ', '아시아 팬 도달', 'text', 8),
(2, 'units', 'title',        'OUR <span>UNITS</span>', 'ユニット', '유닛', 'html', 1),
(2, 'focus', 'title',        'EDITORIAL MANAGEMENT AND <span>MEDIA PRODUCTIONS</span>', 'エディトリアルマネジメント＆<span>メディアプロダクション</span>', '편집 관리 및 <span>미디어 프로덕션</span>', 'html', 1),
(2, 'cta', 'title',          'CONNECT WITH MILLIONS OF ASIAN FOOTBALL FANS', '何百万人ものアジアのサッカーファンとつながる', '수백만 아시아 축구 팬과 연결하세요', 'text', 1),
(2, 'cta', 'description',    'Join leading European clubs expanding their presence across Asia. We deliver authentic engagement, measurable results, and seamless fan experiences from digital activations to live events and tours.', 'アジア全域でプレゼンスを拡大する主要ヨーロッパクラブに参加しましょう。', '아시아 전역에서 입지를 확대하는 주요 유럽 클럽에 합류하세요.', 'text', 2),
(2, 'cta', 'button_text',    'Start Your Journey', '旅を始める', '여정을 시작하세요', 'text', 3);

-- =============================================
-- CONTENT BLOCKS — CLIENTS
-- =============================================
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(3, 'hero', 'title',    'THE CLUBS AND LEAGUES<br><span>THAT TRUST US</span>', '私たちを信頼する<br><span>クラブとリーグ</span>', '우리를 신뢰하는<br><span>클럽과 리그</span>', 'html', 1),
(3, 'hero', 'subtitle', 'We partner with top European football brands to drive engagement and growth across Asian markets.', 'アジア市場全域でのエンゲージメントと成長を推進するため、ヨーロッパのトップサッカーブランドと提携しています。', '아시아 시장 전역에서 참여와 성장을 촉진하기 위해 유럽 최고의 축구 브랜드와 파트너십을 맺고 있습니다.', 'text', 2),
(3, 'gallery', 'title',  'Our Clients', 'クライアント', '클라이언트', 'text', 1),
(3, 'cta', 'title',      'JOIN OUR ROSTER', '私たちのロスターに参加', '우리의 로스터에 합류하세요', 'text', 1),
(3, 'cta', 'description','Become part of our growing network of European football brands succeeding in Asian markets.', 'アジア市場で成功しているヨーロッパサッカーブランドの成長ネットワークの一員になりましょう。', '아시아 시장에서 성공하고 있는 유럽 축구 브랜드의 성장 네트워크에 합류하세요.', 'text', 2);

-- =============================================
-- CONTENT BLOCKS — TEAM
-- =============================================
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(4, 'hero', 'title',       'OUR<br><span>STARTING LINEUP</span>', 'スターティング<br><span>ラインナップ</span>', '스타팅<br><span>라인업</span>', 'html', 1),
(4, 'hero', 'subtitle',    'A diverse team of football industry professionals from around the globe, united by our passion for the beautiful game and dedicated to bridging European football with Asian audiences.', 'サッカーへの情熱で結ばれた、世界中から集まったフットボール業界のプロフェッショナルチーム。', '축구에 대한 열정으로 하나된 전 세계의 축구 산업 전문가 팀.', 'text', 2),
(4, 'strengths', 'title',  'OUR TEAM <span>STRENGTHS</span>', 'チームの<span>強み</span>', '팀의 <span>강점</span>', 'html', 1);

-- =============================================
-- CONTENT BLOCKS — PARTNERS
-- =============================================
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(5, 'hero', 'title',        'OUR<br><span>PARTNER NETWORK</span>', 'パートナー<br><span>ネットワーク</span>', '파트너<br><span>네트워크</span>', 'html', 1),
(5, 'hero', 'subtitle',     'We collaborate with leading platforms, media companies and tech providers across Asia to deliver maximum impact for our clients.', 'クライアントに最大のインパクトを提供するため、アジア全域の主要プラットフォーム、メディア企業、テクノロジープロバイダーと連携しています。', '클라이언트에게 최대의 임팩트를 제공하기 위해 아시아 전역의 주요 플랫폼, 미디어 기업, 기술 제공업체와 협력합니다.', 'text', 2),
(5, 'constellation', 'title',    'OUR <span>CONSTELLATION</span>', 'コンステレーション', '콘스텔레이션', 'html', 1),
(5, 'constellation', 'subtitle', 'A network of strategic partnerships across Asia''s most influential digital platforms and media companies.', 'アジアで最も影響力のあるデジタルプラットフォームとメディア企業との戦略的パートナーシップネットワーク。', '아시아에서 가장 영향력 있는 디지털 플랫폼 및 미디어 기업과의 전략적 파트너십 네트워크.', 'text', 2),
(5, 'benefits', 'title',    'PARTNERSHIP <span>BENEFITS</span>', 'パートナーシップの<span>メリット</span>', '파트너십 <span>혜택</span>', 'html', 1);

-- =============================================
-- CONTENT BLOCKS — CONTACT
-- =============================================
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(7, 'hero', 'title',    'LET''S <span>CONNECT</span>', 'お問い<span>合わせ</span>', '<span>연락</span>하기', 'html', 1),
(7, 'hero', 'subtitle', 'Ready to expand your football brand in Asia? Our team is here to help you navigate the region''s dynamic digital landscape.', 'アジアでサッカーブランドを拡大する準備はできましたか？私たちのチームがダイナミックなデジタルランドスケープをナビゲートするお手伝いをします。', '아시아에서 축구 브랜드를 확장할 준비가 되셨나요? 저희 팀이 역동적인 디지털 환경을 탐색하는 데 도움을 드리겠습니다.', 'text', 2),
(7, 'info', 'title',    'GET IN <span>TOUCH</span>', 'お問い<span>合わせ先</span>', '연락<span>처</span>', 'html', 1),
(7, 'form', 'title',    'SEND US A <span>MESSAGE</span>', 'メッセージを<span>送る</span>', '메시지 <span>보내기</span>', 'html', 1),
(7, 'faq', 'title',     'FREQUENTLY ASKED <span>QUESTIONS</span>', 'よくある<span>質問</span>', '자주 묻는 <span>질문</span>', 'html', 1);

-- =============================================
-- CONTENT BLOCKS — TOKYO SUMMIT
-- =============================================
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(6, 'hero', 'title',    'TOKYO SUMMIT<br><span>2026</span>', 'TOKYO SUMMIT<br><span>2026</span>', 'TOKYO SUMMIT<br><span>2026</span>', 'html', 1),
(6, 'hero', 'subtitle', 'The Premier Football Business Event Connecting Europe and Asia', 'ヨーロッパとアジアを結ぶプレミアフットボールビジネスイベント', '유럽과 아시아를 연결하는 프리미어 축구 비즈니스 이벤트', 'text', 2);

-- Tokyo Summit — Live sections (About, Objectives, Audience, Register)
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(6, 'about', 'title',       'ABOUT THE <span>SUMMIT</span>', 'サミット<span>について</span>', '서밋 <span>소개</span>', 'html', 10),
(6, 'about', 'description', 'Tokyo Summit 2026 is the premier gathering for football industry leaders, club executives, marketing professionals, and digital innovators from Europe and Asia. Join us for three days of networking, insights, and strategic discussions on the future of football business in the Asian market.', 'Tokyo Summit 2026は、ヨーロッパとアジアのサッカー業界リーダー、クラブ幹部、マーケティング専門家、デジタルイノベーターのための最高峰の集会です。', 'Tokyo Summit 2026는 유럽과 아시아의 축구 산업 리더, 클럽 임원, 마케팅 전문가, 디지털 혁신가를 위한 최고의 모임입니다.', 'text', 20),
(6, 'about', 'card1_title', 'Networking Opportunities', 'ネットワーキングの機会', '네트워킹 기회', 'text', 30),
(6, 'about', 'card1_desc',  'Connect with 500+ senior executives from top European clubs and Asian football organizations in dedicated networking sessions.', 'トップヨーロッパクラブとアジアのサッカー組織の500人以上の上級幹部とつながります。', '유럽 최고 클럽과 아시아 축구 조직의 500명 이상의 임원과 교류하세요.', 'text', 40),
(6, 'about', 'card2_title', 'Market Insights', '市場インサイト', '시장 인사이트', 'text', 50),
(6, 'about', 'card2_desc',  'Gain exclusive insights into Asian football markets, fan behavior, and commercial opportunities from industry experts.', '業界専門家からアジアのサッカー市場、ファン行動、商業機会に関する独自の洞察を得ます。', '업계 전문가로부터 아시아 축구 시장, 팬 행동, 상업적 기회에 대한 독점적 인사이트를 얻으세요.', 'text', 60),
(6, 'about', 'card3_title', 'Expert Speakers', '専門スピーカー', '전문 연사', 'text', 70),
(6, 'about', 'card3_desc',  'Learn from 50+ influential speakers including club presidents, marketing directors, and digital strategy leaders.', 'クラブ会長、マーケティングディレクター、デジタル戦略リーダーを含む50人以上の有力スピーカーから学びます。', '클럽 회장, 마케팅 디렉터, 디지털 전략 리더 등 50명 이상의 영향력 있는 연사에게 배우세요.', 'text', 80);

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(6, 'objectives', 'title',      'SUMMIT <span>OBJECTIVES</span>', 'サミットの<span>目標</span>', '서밋 <span>목표</span>', 'html', 10),
(6, 'objectives', 'item1_title','Bridge European & Asian Football', 'ヨーロッパとアジアのサッカーを繋ぐ', '유럽과 아시아 축구를 연결', 'text', 20),
(6, 'objectives', 'item1_desc', 'Create meaningful connections between European football clubs and Asian markets, fostering mutual understanding and collaboration across continents.', 'ヨーロッパのサッカークラブとアジア市場の間に有意義なつながりを作り、大陸を越えた相互理解と協力を育みます。', '유럽 축구 클럽과 아시아 시장 간의 의미 있는 연결을 만들고 대륙을 초월한 상호 이해와 협력을 증진합니다.', 'text', 30),
(6, 'objectives', 'item2_title','Share Market Intelligence', '市場インテリジェンスの共有', '시장 인텔리전스 공유', 'text', 40),
(6, 'objectives', 'item2_desc', 'Provide deep insights into Asian football markets, fan culture, digital consumption patterns, and commercial opportunities for European clubs.', 'アジアのサッカー市場、ファン文化、デジタル消費パターン、ヨーロッパクラブの商業機会に関する深い洞察を提供します。', '아시아 축구 시장, 팬 문화, 디지털 소비 패턴, 유럽 클럽을 위한 상업적 기회에 대한 깊은 인사이트를 제공합니다.', 'text', 50),
(6, 'objectives', 'item3_title','Foster Strategic Partnerships', '戦略的パートナーシップの育成', '전략적 파트너십 육성', 'text', 60),
(6, 'objectives', 'item3_desc', 'Facilitate B2B meetings and networking opportunities that lead to concrete partnerships, sponsorships, and collaborative projects.', 'B2Bミーティングとネットワーキングの機会を促進し、具体的なパートナーシップ、スポンサーシップ、共同プロジェクトにつなげます。', 'B2B 미팅과 네트워킹 기회를 촉진하여 구체적인 파트너십, 스폰서십, 협업 프로젝트로 이어지게 합니다.', 'text', 70);

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(6, 'audience', 'title',      'WHO SHOULD <span>ATTEND</span>', '参加すべき<span>方</span>', '참가 <span>대상</span>', 'html', 10),
(6, 'audience', 'card1_title','Club Executives', 'クラブ幹部', '클럽 임원', 'text', 20),
(6, 'audience', 'card1_desc', 'CEOs, Presidents, and Directors from European football clubs looking to expand into Asian markets and build their international presence.', 'アジア市場への進出と国際的なプレゼンス構築を目指すヨーロッパサッカークラブのCEO、会長、ディレクター。', '아시아 시장 진출과 국제적 입지 강화를 원하는 유럽 축구 클럽의 CEO, 회장, 이사.', 'text', 30),
(6, 'audience', 'card2_title','Marketing Directors', 'マーケティングディレクター', '마케팅 디렉터', 'text', 40),
(6, 'audience', 'card2_desc', 'Marketing and commercial leaders responsible for international expansion, brand development, and fan engagement strategies.', '国際展開、ブランド開発、ファンエンゲージメント戦略を担当するマーケティング・商業リーダー。', '국제 확장, 브랜드 개발, 팬 참여 전략을 담당하는 마케팅 및 상업 리더.', 'text', 50),
(6, 'audience', 'card3_title','Digital Strategy Heads', 'デジタル戦略責任者', '디지털 전략 책임자', 'text', 60),
(6, 'audience', 'card3_desc', 'Digital and social media executives focused on content localization, platform strategy, and Asian fan community building.', 'コンテンツローカライゼーション、プラットフォーム戦略、アジアファンコミュニティ構築に注力するデジタル・ソーシャルメディア幹部。', '콘텐츠 현지화, 플랫폼 전략, 아시아 팬 커뮤니티 구축에 집중하는 디지털 및 소셜 미디어 임원.', 'text', 70),
(6, 'audience', 'card4_title','Sponsorship Managers', 'スポンサーシップマネージャー', '스폰서십 매니저', 'text', 80),
(6, 'audience', 'card4_desc', 'Partnership and sponsorship professionals seeking Asian brand collaborations and commercial opportunities in football.', 'サッカーにおけるアジアブランドのコラボレーションと商業機会を求めるパートナーシップ・スポンサーシップ専門家。', '축구에서 아시아 브랜드 협업과 상업적 기회를 모색하는 파트너십 및 스폰서십 전문가.', 'text', 90);

INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(6, 'register', 'title',       'REGISTER NOW', '今すぐ登録', '지금 등록', 'text', 10),
(6, 'register', 'description', 'Secure your spot at Tokyo Summit 2026. Limited seats available for this exclusive football business event.', 'Tokyo Summit 2026でのあなたの席を確保してください。この独占的なフットボールビジネスイベントの座席は限られています。', 'Tokyo Summit 2026에서 귀하의 자리를 확보하세요. 이 독점적인 축구 비즈니스 이벤트의 좌석이 제한되어 있습니다.', 'text', 20),
(6, 'register', 'submit_btn',  'SUBMIT REGISTRATION', '登録を送信', '등록 제출', 'text', 30);

-- Contact page — Form section text
INSERT INTO content_blocks (page_id, section, block_key, content_en, content_ja, content_ko, block_type, sort_order) VALUES
(7, 'form', 'header_title', 'CONTACT FORM', 'お問い合わせフォーム', '문의 양식', 'text', 10),
(7, 'form', 'description',  'Fill out the form below and our team will get back to you within 24 hours to discuss how we can help with your football strategy in Asia.', '以下のフォームにご記入いただければ、24時間以内にチームがアジアでのフットボール戦略についてご連絡いたします。', '아래 양식을 작성하시면 24시간 이내에 아시아 축구 전략에 대해 논의하기 위해 팀이 연락드리겠습니다.', 'text', 20),
(7, 'form', 'submit_btn',   'SEND MESSAGE', 'メッセージを送る', '메시지 보내기', 'text', 30),
(7, 'form', 'footer_note',  '* Required fields. We typically respond within 24 hours on business days.', '* 必須項目。通常、営業日に24時間以内にご連絡いたします。', '* 필수 항목. 일반적으로 영업일 기준 24시간 이내에 답변드립니다.', 'text', 40);

-- =============================================
-- TEAM MEMBERS
-- =============================================
INSERT INTO team_members (name, position_en, position_ja, position_ko, photo_url, department, field_position, sort_order) VALUES
('Cesare Polenghi',     'FOUNDER & CEO',                                       'ファウンダー＆CEO',                         '창립자 & CEO',                          'img/cesare.JPG',         'leadership',       'coach',      0),
('Matteo Dellavite',    'HEAD OF CLIENT SERVICES & MEDIA FACTORY',             'クライアントサービス＆メディアファクトリー責任者', '클라이언트 서비스 & 미디어 팩토리 책임자', 'img/matteo.JPG',         'operations',       'goalkeeper',  1),
('Ngoc Nguyen',         'CFO',                                                 'CFO',                                       'CFO',                                   'img/ngoc.JPG',           'leadership',       'defender',    2),
('Valeria Paz Taixés',  'HEAD OF PR & INTERNAL COMMUNICATIONS',                'PR＆社内コミュニケーション責任者',             'PR & 사내 커뮤니케이션 책임자',           'img/valeria.jpg',        'operations',       'defender',    3),
('Arashi Higaki',       'HEAD OF EDITORIAL TEAM & COUNTRY MANAGER JAPAN',      '編集チーム責任者＆日本カントリーマネージャー',   '편집팀 책임자 & 일본 국가 매니저',         'img/Arashi Profile.png', 'editorial',        'defender',    4),
('Junghak Lee',         'COUNTRY MANAGER KOREA',                               '韓国カントリーマネージャー',                  '한국 국가 매니저',                       'img/JHL.jpg',            'country-managers',  'defender',    5),
('Kazu Uehara',         'HEAD OF GRASSROOTS PROGRAMS',                         'グラスルーツプログラム責任者',                 '풀뿌리 프로그램 책임자',                  'img/kazu.jpg',           'operations',       'midfielder',  6),
('Goki Kazami',         'HEAD OF FAN COORDINATION',                            'ファンコーディネーション責任者',               '팬 코디네이션 책임자',                    'img/goki.jpg',           'operations',       'midfielder',  7),
('Sha Tao',             'COUNTRY MANAGER CHINA',                               '中国カントリーマネージャー',                  '중국 국가 매니저',                       'img/sha.jpg',            'country-managers',  'midfielder',  8),
('Eric Noveanto',       'COUNTRY MANAGER INDONESIA',                           'インドネシアカントリーマネージャー',           '인도네시아 국가 매니저',                  'img/eric.png',           'country-managers',  'forward',     9),
('Quang T. Pham',       'COUNTRY MANAGER VIETNAM',                             'ベトナムカントリーマネージャー',               '베트남 국가 매니저',                      'img/quang.jpg',          'country-managers',  'forward',    10),
('Mario Kawata',        'SENIOR EDITOR JAPAN',                                 'シニアエディター日本',                        '시니어 편집자 일본',                      'img/Mario.jpg',          'editorial',        'forward',    11);

-- =============================================
-- CLIENTS
-- =============================================
INSERT INTO clients (name, logo_url, category, sort_order) VALUES
('Bundesliga',               'img/clients/bundesliga.png',                    'league',      1),
('FIFA',                     'img/clients/fifa.png',                          'federation',  2),
('UEFA Champions League',    'img/clients/champions.png',                     'league',      3),
('Asian Football Confederation', 'img/clients/afc.svg',                      'federation',  4),
('Serie A',                  'img/clients/Italian-Serie-A-Logo.png',          'league',      5),
('Atlético de Madrid',       'img/clients/Atletico_Madrid_Logo_2024.svg.png', 'club',        6),
('Real Sociedad',            'img/clients/download.png',                      'club',        7),
('Borussia Dortmund',        'img/clients/borussia.png',                      'club',        8),
('Aston Villa',              'img/clients/aston.svg',                         'club',        9),
('Real Betis',               'img/clients/realbetis.png',                     'club',       10),
('Atalanta B.C.',            'img/clients/atalanta.png',                      'club',       11),
('SSC Napoli',               'img/clients/napoli2.jpg',                       'club',       12),
('Parma Calcio 1913',        'img/clients/parma.png',                         'club',       13),
('Celtic FC',                'img/clients/Celtic-logo.png',                   'club',       14),
('Brighton & Hove Albion',   'img/clients/brighton.svg',                      'club',       15),
('VfB Stuttgart',            'img/clients/stuttgart.svg',                      'club',       16),
('RCD Mallorca',             'img/clients/mallorca.png',                      'club',       17),
('Feyenoord Rotterdam',      'img/clients/feyenoord.png',                     'club',       18),
('1. FC Köln',               'img/clients/koln.svg',                          'club',       19),
('1. FSV Mainz 05',          'img/clients/mainz.png',                         'club',       20),
('Birmingham City FC',       'img/clients/Birmingham_City_FC_logo.svg.png',   'club',       21);

-- =============================================
-- PARTNERS
-- =============================================
INSERT INTO partners (name, logo_url, category, country, sort_order) VALUES
('SportsNavi',   'img/partners/sportsnavi.png', 'platform', 'Japan',        1),
('LINE',         'img/partners/line.png',       'platform', 'Japan',        2),
('WEIBO',        'img/partners/weibo.png',      'platform', 'China',        3),
('NAVER',        'img/partners/naver1.webp',    'platform', 'South Korea',  4),
('Kakao',        'img/partners/kakao.png',      'platform', 'South Korea',  5),
('X (Twitter)',  'img/partners/x.png',          'platform', 'Global',       6),
('Vidio',        'img/partners/vidio.png',      'platform', 'Indonesia',    7),
('TikTok',       'img/partners/tiktok.png',     'platform', 'Global',       8),
('Kuaishou',     'img/partners/kuaishou.png',   'platform', 'China',        9),
('Wakatake',     'img/partners/wakatake.png',   'media',    'Japan',       10),
('Futbology',    'img/partners/futbology.png',  'media',    'Global',      11),
('KgNow',        'img/partners/kgnow.png',      'media',    'South Korea', 12),
('Fbin',         'img/partners/fbin.png',       'media',    'Vietnam',     13);

-- =============================================
-- SERVICES (6 units)
-- =============================================
INSERT INTO services (slug, icon_class, image_url, title_en, title_ja, title_ko, description_en, description_ja, description_ko, sort_order) VALUES
('editorial-team',    'fas fa-edit',       'img/Socials_Proflie_GET_B.jpg', 'GANASSA EDITORIAL TEAM',         'GANASSA エディトリアルチーム',       'GANASSA 에디토리얼 팀',        'We manage your social media and deliver impactful campaigns and content to maximize reach across Asia, setting up accounts, localizing content, and connecting you with your audience.', 'ソーシャルメディアを管理し、アジア全域でリーチを最大化するインパクトのあるキャンペーンとコンテンツを提供します。', '소셜 미디어를 관리하고 아시아 전역에서 도달 범위를 극대화하는 임팩트 있는 캠페인과 콘텐츠를 제공합니다.', 1),
('media-factory',     'fas fa-film',       'img/Socials_Proflie_GMF_B.jpg', 'GANASSA MEDIA FACTORY',          'GANASSA メディアファクトリー',       'GANASSA 미디어 팩토리',        'We craft powerful digital stories and content that connect fans, sponsors, investors, and clubs, driving engagement and creating lasting value.', 'ファン、スポンサー、投資家、クラブをつなぐ強力なデジタルストーリーとコンテンツを制作します。', '팬, 스폰서, 투자자, 클럽을 연결하는 강력한 디지털 스토리와 콘텐츠를 제작합니다.', 2),
('grassroots',        'fas fa-futbol',     'img/Socials_Proflie_GGP_B.jpg', 'GANASSA GRASSROOTS PROGRAMS',    'GANASSA グラスルーツプログラム',     'GANASSA 풀뿌리 프로그램',      'We support and organize football camps and academies across Asia, bringing top European clubs closer to young and local talents.', 'アジア全域でサッカーキャンプとアカデミーをサポート・運営し、ヨーロッパのトップクラブと若手のローカルタレントを結びます。', '아시아 전역에서 축구 캠프와 아카데미를 지원 및 운영하여 유럽 최고의 클럽과 젊은 현지 인재를 연결합니다.', 3),
('fans-coordination', 'fas fa-users',      'img/Socials_Proflie_GFC_B.jpg', 'GANASSA FANS COORDINATION',      'GANASSA ファンコーディネーション',   'GANASSA 팬 코디네이션',        'We connect clubs with local fan communities, organizing watch parties, meet-ups, engagement campaigns, and more.', 'クラブとローカルファンコミュニティをつなぎ、ウォッチパーティー、ミートアップ、エンゲージメントキャンペーンなどを組織します。', '클럽과 현지 팬 커뮤니티를 연결하고 시청 파티, 밋업, 참여 캠페인 등을 조직합니다.', 4),
('merchandise',       'fas fa-tshirt',     'img/Socials_Proflie_GMD_B.jpg', 'GANASSA MERCHANDISE DEPARTMENT', 'GANASSA マーチャンダイズ部門',       'GANASSA 머천다이즈 부서',      'We design and distribute exclusive merchandise to help clubs grow their brand presence in key markets.', '独占的なマーチャンダイズをデザイン・配布し、クラブが主要市場でブランドプレゼンスを拡大するのを支援します。', '독점 상품을 디자인하고 배포하여 클럽이 주요 시장에서 브랜드 존재감을 높이도록 지원합니다.', 5),
('social-responsibility', 'fas fa-heart', 'img/Socials_Profile_GSR_B.jpg', 'GANASSA SOCIAL RESPONSIBILITY',  'GANASSA ソーシャルレスポンシビリティ', 'GANASSA 사회적 책임',          'We give back by supporting nonprofit football associations that foster youth talent and promote education, inclusion, and development worldwide.', '若い才能を育成し、教育、インクルージョン、発展を世界中で促進する非営利サッカー協会を支援して社会に貢献します。', '청소년 인재를 육성하고 전 세계적으로 교육, 포용, 발전을 촉진하는 비영리 축구 협회를 지원합니다.', 6);

-- =============================================
-- FAQ ITEMS (contact page)
-- =============================================
INSERT INTO faq_items (page_id, question_en, question_ja, question_ko, answer_en, answer_ja, answer_ko, sort_order) VALUES
(7, 'What is your typical response time for inquiries?', 'お問い合わせへの通常の回答時間はどのくらいですか？', '문의에 대한 일반적인 응답 시간은 얼마나 되나요?',
    'We aim to respond to all inquiries within 24 hours during business days (Monday-Friday). Our team across different time zones ensures prompt communication regardless of your location.', '営業日（月曜日〜金曜日）中に24時間以内にすべてのお問い合わせに回答することを目指しています。', '영업일(월~금) 기준 24시간 이내에 모든 문의에 응답하는 것을 목표로 합니다.', 1),

(7, 'Which office should I contact for my specific market?', '特定の市場についてはどのオフィスに連絡すべきですか？', '특정 시장에 대해 어느 사무실에 연락해야 하나요?',
    'You can contact us through the form below for any market. Our central team will route your inquiry to the appropriate regional specialists in Tokyo, Seoul, Jakarta, Hanoi, Shanghai, or Madrid based on your specific needs.', '以下のフォームからどの市場についてもお問い合わせいただけます。中央チームが東京、ソウル、ジャカルタ、ハノイ、上海、またはマドリードの適切な地域スペシャリストにお問い合わせを転送します。', '아래 양식을 통해 어떤 시장에 대해서든 문의하실 수 있습니다. 중앙 팀이 도쿄, 서울, 자카르타, 하노이, 상하이 또는 마드리드의 적절한 지역 전문가에게 문의를 전달합니다.', 2),

(7, 'Do you offer consultations before formal engagement?', '正式な契約前にコンサルテーションを提供していますか？', '공식 계약 전에 상담을 제공하나요?',
    'Yes, we offer complimentary 30-minute discovery calls to discuss your needs and determine how we can help. Please indicate this preference in your inquiry message.', 'はい、お客様のニーズを話し合い、どのようにお手伝いできるかを判断するための30分の無料ディスカバリーコールを提供しています。', '네, 고객님의 요구 사항을 논의하고 저희가 어떻게 도움을 드릴 수 있는지 파악하기 위한 30분 무료 디스커버리 콜을 제공합니다.', 3),

(7, 'What information should I include in my initial inquiry?', '最初のお問い合わせにはどのような情報を含めるべきですか？', '초기 문의 시 어떤 정보를 포함해야 하나요?',
    'Please include your company background, specific Asian markets of interest, current challenges or goals, timeline considerations, and any previous experience in Asian markets.', '会社の背景、関心のあるアジア市場、現在の課題や目標、タイムラインの考慮事項、アジア市場での過去の経験を含めてください。', '회사 배경, 관심 있는 아시아 시장, 현재 과제 또는 목표, 타임라인 고려 사항, 아시아 시장에서의 이전 경험을 포함해 주세요.', 4);

-- =============================================
-- SITE SETTINGS
-- =============================================
INSERT INTO site_settings (key, value_en, value_ja, value_ko) VALUES
('site_name',        'GANASSA', 'GANASSA', 'GANASSA'),
('site_slogan',      'Football Solutions Across Asia', 'アジア全域のフットボールソリューション', '아시아 전역 축구 솔루션'),
('contact_email',    'info@ganassa.jp', 'info@ganassa.jp', 'info@ganassa.jp'),
('footer_copyright', '© 2025 GANASSA. All Rights Reserved. | Football Solutions Across Asia', '© 2025 GANASSA. All Rights Reserved. | アジア全域のフットボールソリューション', '© 2025 GANASSA. All Rights Reserved. | 아시아 전역 축구 솔루션'),
('social_linkedin',  '#', '#', '#'),
('social_twitter',   '#', '#', '#'),
('social_instagram', '#', '#', '#'),
('office_japan',     'Ganassa LLC - Tokyo and Higashikawa, Japan', 'Ganassa LLC - 東京・東川、日本', 'Ganassa LLC - 도쿄 및 히가시카와, 일본'),
('office_singapore', 'Ganassa PTE LTD - Singapore', 'Ganassa PTE LTD - シンガポール', 'Ganassa PTE LTD - 싱가포르'),
('office_china',     'Ganassa Sports Consulting LTD - Shanghai, China', 'Ganassa Sports Consulting LTD - 上海、中国', 'Ganassa Sports Consulting LTD - 상하이, 중국'),
('office_spain',     'Ganassa Europe - Madrid, Spain', 'Ganassa Europe - マドリード、スペイン', 'Ganassa Europe - 마드리드, 스페인');