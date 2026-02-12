import React from 'react';
import Image from 'next/image';
import PageTitle from '@/components/PageTitle';

export default async function ProductsPage({ params }) {
  // انتظار الباراميترز لضمان العمل مع نسخ Next.js الحديثة
  const { lang: rawLang } = await params;
  const lang = rawLang === 'en' ? 'en' : 'ar';
  const isRtl = lang === 'ar';

  // نصوص الواجهة العامة
  const labels = {
    uses: isRtl ? 'الاستخدامات:' : 'Uses:',
    specs: isRtl ? 'المواصفات التصديرية:' : 'Export Specifications:',
    pageTitle: isRtl ? 'منتجاتنا' : 'Our Products',
    pageSubtitle: isRtl 
      ? 'نقدم أجود المنتجات الزراعية الطبيعية السودانية المعدة للتصدير وفقاً لأعلى المعايير العالمية.' 
      : 'We offer the finest natural Sudanese agricultural products prepared for export according to the highest international standards.'
  };

  // قاعدة البيانات (تم تعريب المصطلحات في العربي، وترجمتها في الإنجليزي)
  const products = [
    {
      id: 1,
      image: '/products/Talha Gum.jpeg',
      ar: {
        name: 'صمغ الطلح',
        description: 'الصمغ العربي من نوع الطلح هو مادة طبيعية متعددة السكريات تُستخرج من أشجار الأكاسيا (Acacia seyal) من خلال عملية التشريط الطبيعي للّحاء. يتكون كيميائياً من سكريات معقدة مثل الأرابينوز والجالاكتوز والرامنوز، ويحتوي على نسبة منخفضة من البروتينات.',
        uses: [
          'الصناعات الغذائية كمثبت ومستحلب (E414)',
          'الصناعات الدوائية كمادة رابطة في الأقراص',
          'صناعة الأحبار والدهانات والمواد اللاصقة',
          'الصناعات التجميلية'
        ],
        specs: [
          'درجة نقاوة عالية',
          'رطوبة منخفضة',
          'خالٍ من الشوائب والأجسام الغريبة',
          'متوفر كعكول (حبيبات) أو مسحوق مطحون'
        ]
      },
      en: {
        name: 'Talha Gum',
        description: 'Talha Gum is a natural polysaccharide extracted from Acacia seyal trees through natural bark tapping. Chemically, it consists of complex sugars like arabinose, galactose, and rhamnose, with low protein content.',
        uses: [
          'Food industry as stabilizer and emulsifier (E414)',
          'Pharmaceutical industry as a tablet binder',
          'Manufacture of inks, paints, and adhesives',
          'Cosmetic industries'
        ],
        specs: [
          'High purity',
          'Low moisture',
          'Free from impurities and foreign matter',
          'Available as nodules (kibbled) or ground powder'
        ]
      }
    },
    {
      id: 2,
      image: '/products/Gum Hashab.jpeg',
      ar: {
        name: 'صمغ الهشاب',
        description: 'يُعتبر صمغ الهشاب من أجود أنواع الصمغ العربي عالمياً، ويُستخرج من أشجار Acacia senegal. يتميز بلونه الفاتح وذوبانيته العالية واستقراره الكيميائي الممتاز. يحتوي على بوليمرات سكريات معقدة مع نسبة بروتين طبيعية تمنحه خصائص استحلاب ممتازة.',
        uses: [
          'الصناعات الغذائية (المشروبات الغازية، الحلويات، المخابز)',
          'الصناعات الدوائية (مادة رابطة ومغلّفة)',
          'الصناعات الصيدلانية والتجميلية',
          'الصناعات الكيميائية'
        ],
        specs: [
          'درجة غذائية ودرجة دوائية (Food & Pharma Grade)',
          'مطابقة لمواصفات FAO/WHO و EU و FDA',
          'خالٍ من المعادن الثقيلة والملوثات',
          'متوفر درجات مختلفة (منقى يدوياً HPS، منظف، مسحوق مجفف بالرذاذ)'
        ]
      },
      en: {
        name: 'Gum Hashab',
        description: 'Gum Hashab is considered the finest Gum Arabic globally, extracted from Acacia senegal trees. It is characterized by its light color, high solubility, and excellent chemical stability. It contains complex sugar polymers with natural protein giving it excellent emulsifying properties.',
        uses: [
          'Food industry (Soft drinks, Confectionery, Bakery)',
          'Pharmaceuticals (Binder and coating agent)',
          'Pharmaceutical and Cosmetic industries',
          'Chemical industries'
        ],
        specs: [
          'Food Grade & Pharmaceutical Grade',
          'Complies with FAO/WHO, EU, and FDA standards',
          'Free from heavy metals and contaminants',
          'Available in various grades (HPS, Cleaned, Spray Dried Powder)'
        ]
      }
    },
    {
      id: 3,
      image: '/products/Frankincense  Olibanum.jpeg',
      ar: {
        name: 'صمغ اللبان',
        description: 'اللبان هو راتنج طبيعي يُستخرج من أشجار Boswellia، ويحتوي على مركبات فعالة مثل الأحماض البوزويلية ذات الخصائص المضادة للالتهابات.',
        uses: [
          'الصناعات العطرية والبخور',
          'الصناعات الدوائية والعلاجية',
          'الطب التقليدي والمكملات الغذائية',
          'صناعة مستحضرات التجميل'
        ],
        specs: [
          'درجات مختلفة حسب اللون والحجم',
          'نسبة زيت عطري عالية',
          'خالٍ من الشوائب',
          'تعبئة سائبة (Bulk) أو عبوات تجزئة (Retail)'
        ]
      },
      en: {
        name: 'Frankincense (Olibanum)',
        description: 'Frankincense is a natural resin extracted from Boswellia trees, containing active compounds like boswellic acids known for their anti-inflammatory properties.',
        uses: [
          'Aromatic industries and Incense',
          'Pharmaceutical and Therapeutic industries',
          'Traditional medicine and Dietary supplements',
          'Cosmetics manufacturing'
        ],
        specs: [
          'Various grades according to color and size',
          'High essential oil content',
          'Free from impurities',
          'Bulk or Retail packaging'
        ]
      }
    },
    {
      id: 4,
      image: '/products/Hibiscus Sabdariffa.jpeg',
      ar: {
        name: 'الكركدي',
        description: 'الكركدي نبات طبي يحتوي على مركبات الأنثوسيانين والفلافونويدات والأحماض العضوية. يتميز بخصائص مضادة للأكسدة ومخفضة لضغط الدم.',
        uses: [
          'صناعة المشروبات الساخنة والباردة',
          'الصناعات الغذائية والملونات الطبيعية',
          'الصناعات الدوائية',
          'مستحضرات التجميل'
        ],
        specs: [
          'زهرة كاملة (Whole Calyx) أو مسحوق',
          'لون أحمر داكن طبيعي',
          'رطوبة منخفضة',
          'مطابق لمعايير النظافة الدولية'
        ]
      },
      en: {
        name: 'Hibiscus Sabdariffa',
        description: 'Hibiscus is a medicinal plant containing anthocyanins, flavonoids, and organic acids. It is characterized by antioxidant and blood pressure-lowering properties.',
        uses: [
          'Hot and cold beverage production',
          'Food industries and Natural colorants',
          'Pharmaceutical industries',
          'Cosmetics'
        ],
        specs: [
          'Whole Calyx or Powder',
          'Natural dark red color',
          'Low moisture',
          'Complies with international hygiene standards'
        ]
      }
    },
    {
      id: 5,
      image: '/products/Peanuts.jpeg',
      ar: {
        name: 'الفول السوداني',
        description: 'الفول السوداني محصول زيتي غني بالبروتين (25–30%) والدهون الصحية (45–50%). يحتوي على فيتامينات ومعادن مهمة.',
        uses: [
          'استخراج زيت الفول السوداني',
          'صناعة زبدة الفول السوداني',
          'الصناعات الغذائية والحلويات',
          'الأعلاف'
        ],
        specs: [
          'جودة تصديرية درجة أولى (Grade A)',
          'خالٍ من الأفلاتوكسين',
          'نسبة كسر منخفضة',
          'تنظيف وفرز ميكانيكي'
        ]
      },
      en: {
        name: 'Peanuts (High Purity)',
        description: 'Peanuts are an oil crop rich in protein (25–30%) and healthy fats (45–50%). They contain important vitamins and minerals.',
        uses: [
          'Peanut oil extraction',
          'Peanut butter manufacturing',
          'Food industries and Confectionery',
          'Animal feed'
        ],
        specs: [
          'Grade A Export Quality',
          'Free from Aflatoxin',
          'Low split ratio',
          'Mechanically cleaned and sorted'
        ]
      }
    },
    {
      id: 6,
      image: '/products/white sesame.jpeg',
      ar: {
        name: 'السمسم الأبيض',
        description: 'يتميز بنسبة زيت عالية تصل إلى 50–55% ويُستخدم في الطحينة والمخبوزات والحلويات.',
        uses: ['يستخدم في الطحينة', 'المخبوزات', 'الحلويات'], // استنتاج للاستخدامات من الوصف
        specs: [
          'تنظيف وفرز آلي (Cleaning & Sorting)',
          'نقاوة تصل إلى 99.95%',
          'رطوبة أقل من 7%',
          'محتوى زيتي عالي'
        ]
      },
      en: {
        name: 'White Sesame',
        description: 'Characterized by high oil content reaching 50–55%, used in Tahini, bakery, and confectionery.',
        uses: ['Tahini production', 'Bakery products', 'Confectionery'],
        specs: [
          'Cleaning & Sorting',
          'Purity up to 99.95%',
          'Moisture less than 7%',
          'High Oil Content'
        ]
      }
    },
    {
      id: 7,
      image: '/products/Sesame Seeds.jpeg',
      ar: {
        name: 'السمسم الأحمر',
        description: 'يُستخدم بشكل رئيسي لاستخراج الزيت الصناعي والغذائي، ويتميز بنكهة قوية وقيمة غذائية عالية.',
        uses: ['استخراج الزيت الصناعي والغذائي'],
        specs: [
          'تنظيف وفرز آلي (Cleaning & Sorting)',
          'نقاوة تصل إلى 99.95%',
          'رطوبة أقل من 7%',
          'محتوى زيتي عالي'
        ]
      },
      en: {
        name: 'Red Sesame Seeds',
        description: 'Mainly used for industrial and edible oil extraction, characterized by a strong flavor and high nutritional value.',
        uses: ['Industrial and edible oil extraction'],
        specs: [
          'Cleaning & Sorting',
          'Purity up to 99.95%',
          'Moisture less than 7%',
          'High Oil Content'
        ]
      },
    },
    {
      id: 8,
      image: '/products/Oil Cake.jpeg',
      ar: {
        name: 'الأمباز',
        description: 'الأمباز هو المنتج الثانوي بعد عصر الزيوت، ويحتوي على نسبة بروتين عالية تصل إلى 40–50%.',
        uses: [
          'أعلاف الدواجن والماشية',
          'صناعة الأعلاف المركزة',
          'الأسمدة العضوية'
        ],
        specs: [
          'مكعبات (Pellet) أو مسحوق',
          'بروتين عالي',
          'رطوبة منخفضة',
          'خالٍ من السموم الفطرية'
        ]
      },
      en: {
        name: 'Oil Cake (Peanut / Sesame)',
        description: 'Oil cake is the byproduct of oil extraction, containing high protein content reaching 40–50%.',
        uses: [
          'Poultry and livestock feed',
          'Concentrated feed manufacturing',
          'Organic fertilizers'
        ],
        specs: [
          'Pellet or Powder',
          'High Protein',
          'Low Moisture',
          'Free from Mycotoxins'
        ]
      }
    },
    {
      id: 9,
      image: '/products/Senna.jpeg',
      ar: {
        name: 'السنمكة',
        description: 'نبات طبي يحتوي على مركبات السيناوسيدات التي تعمل كمُلين طبيعي.',
        uses: [
          'الصناعات الدوائية',
          'الطب العشبي',
          'المكملات الغذائية'
        ],
        specs: [
          'أوراق أو قرون',
          'نسبة مواد فعالة عالية',
          'خالٍ من المبيدات والمعادن الثقيلة',
          'مطابق لمعايير دستور الأدوية العشبي (WHO Herbal Monographs)'
        ]
      },
      en: {
        name: 'Senna (Cassia Angustifolia)',
        description: 'A medicinal plant containing sennosides which act as a natural laxative.',
        uses: [
          'Pharmaceutical industries',
          'Herbal medicine',
          'Dietary supplements'
        ],
        specs: [
          'Leaves or Pods',
          'High active content',
          'Free from pesticides and heavy metals',
          'Complies with WHO Herbal Monographs'
        ]
      }
    }
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
      <PageTitle 
        title={labels.pageTitle}
        subtitle={labels.pageSubtitle}
      />

      <section className="py-12 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            // تحديد المحتوى بناءً على اللغة
            const content = isRtl ? product.ar : product.en;
            
            return (
              <div 
                key={product.id} 
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group"
              >
                {/* قسم الصورة */}
                <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={content.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* تم إزالة طبقة النص الشفاف واسم الصورة حسب طلبك */}
                </div>

                {/* قسم المحتوى */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {content.name}
                    </h3>
                  </div>

                  <p className="text-gray-600 mb-6 text-sm leading-relaxed flex-grow">
                    {content.description}
                  </p>

                  {/* قسم الاستخدامات */}
                  {content.uses && content.uses.length > 0 && (
                    <div className="mb-4">
                      <h5 className="font-bold text-gray-800 mb-2 text-sm border-b pb-1 inline-block border-primary/20 text-primary">
                        {labels.uses}
                      </h5>
                      <ul className={`list-disc text-sm text-gray-600 space-y-1 marker:text-primary ${isRtl ? 'pr-5' : 'pl-5'}`}>
                        {content.uses.map((use, index) => (
                          <li key={index}>{use}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* قسم المواصفات */}
                  <div className="mt-auto pt-4 border-t border-gray-100 bg-gray-50/50 -mx-6 -mb-6 px-6 py-4">
                    <h5 className="font-bold text-gray-800 mb-2 text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                      {labels.specs}
                    </h5>
                    <ul className="text-xs text-gray-500 space-y-1 grid grid-cols-1 sm:grid-cols-2 gap-x-2">
                      {content.specs.map((spec, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}