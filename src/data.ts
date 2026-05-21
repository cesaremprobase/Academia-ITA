import { Course } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'vida-abundante',
    title: 'Vida Abundante',
    subtitle: 'Manual del Discípulo - Escuela de Discipulado y Liderazgo',
    description: 'Curso fundamental de discipulado cristiano para comprender la Salvación, la Biblia, la Oración, la Iglesia y los Sacramentos. Desarrollado por los Pastores Olivos & Cecilia Vega de la Iglesia "Templo Apostólico" - Las Asambleas de Dios del Perú.',
    category: 'Discipulado',
    author: 'Pastores Olivos & Cecilia Vega',
    duration: '11 Lecciones',
    logoColor: 'from-amber-500 to-orange-600',
    iconName: 'book-open',
    lessons: [
      {
        id: 'bienvenida',
        title: '¡Bienvenida al Discipulado!',
        subtitle: 'Inicio y Visión del Camino',
        index: 0,
        welcome: true,
        content: [
          {
            title: '¡Le damos la Bienvenida a la Familia de Dios!',
            subtitle: 'Su vida no será la misma de ahora en adelante',
            paragraphs: [
              'Hoy, usted comienza una vida de crecimiento continuo como creyente.',
              'Estas clases de discipulado le ayudarán para tener una Vida en Abundancia, comprendiendo la doctrina Bíblica, el manejo de la Biblia y la Misión que ha dado Dios para el nuevo creyente.',
              'A continuación, la clase en forma de guía, la cual usted llenará y en la próxima lección tendrá una hoja de repaso y así sucesivamente.',
              'Adelante, tenga confianza en Dios y en sus Pastores, ellos siempre estarán dispuestos para ayudarlo, para no detenerse en el entrenamiento personalizado. Recuerde, para su Pastor y su Maestra es un privilegio acompañarlo a resolver sus primeros interrogantes.',
              '¡Dios está con Usted!'
            ]
          }
        ],
        reviewQuestions: []
      },
      {
        id: 'guia-1',
        title: 'Guía N° 1: ¿Qué es la Salvación?',
        subtitle: 'Comprendiendo el regalo divino',
        index: 1,
        content: [
          {
            title: 'I. SALVACIÓN',
            paragraphs: [
              'Es la obra hecha por Jesucristo por medio de la cual se muestra el amor de Dios a la humanidad (Efesios 2:8-9; Apocalipsis 3:20).'
            ],
            verses: [
              { reference: 'Efesios 2:8-9', text: 'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe.' },
              { reference: 'Apocalipsis 3:20', text: 'He aquí, yo estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré a él, y cenaré con él, y él conmigo.' }
            ]
          },
          {
            title: 'II. PASOS FUNDAMENTALES PARA RECIBIRLA',
            paragraphs: [
              'A. Conocer el plan de la Salvación (Oseas 4:6). Significa en la Biblia agarrarse o adherirse en este caso a Jesús, el único camino (Juan 14:6).',
              'B. El arrepentimiento en el plan de Salvación (Romanos 1:16-17). El evangelio es anunciado para salvación a todo el que cree.',
              'C. Es necesario confesar el plan de Salvación (Romanos 10:9-10). Que Jesucristo es el único mediador (1 Timoteo 2:5) de todos los pecados y arrepentirse ante el Señor Jesucristo (Proverbios 28:13). El arrepentimiento es diferente a remordimiento.',
              'D. Descuidar la Salvación (Hebreos 2:1-3). Es necesario que el hombre preste atención y retenga lo que ha recibido (Hebreos 10:26-27).'
            ],
            verses: [
              { reference: 'Oseas 4:6', text: 'Mi pueblo fue destruido, porque le faltó conocimiento...' },
              { reference: 'Juan 14:6', text: 'Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.' },
              { reference: 'Romanos 10:9', text: 'Que si confesares con tu boca que Jesús es el Señor, y creyeres en tu corazón que Dios le levantó de los muertos, serás salvo.' },
              { reference: 'Proverbios 28:13', text: 'El que encubre sus pecados no prosperará; mas el que los confiesa y se aparta alcanzará misericordia.' }
            ]
          },
          {
            title: 'III. RESULTADOS DE LA SALVACIÓN',
            paragraphs: [
              'A. Toda persona que se arrepiente y cree al Señor Jesucristo recibe perdón de pecados (Hechos 10:43), vive en Vida Nueva (Romanos 6:4), anda de Día (Romanos 13:13), crece en Santidad (2 Pedro 3:11) y se viste con Vestiduras Blancas (Apocalipsis 3:4).',
              'B. Paz con Dios (Romanos 5:1-2). Tenemos paz justificados mediante la fe, en el cual nos vemos soberanos de su gracia. Se siente la verdadera felicidad.',
              'C. Regeneración (Tito 3:5). Cambiamos totalmente porque la unción de Dios se lleva toda nuestra carga (2 Corintios 5:17).',
              'D. Adopción (Juan 1:9-13). Recibimos el derecho de ser hijos de Dios y herederos de sus promesas (Gálatas 4:4-7). Por su gracia soberana, no por nuestras obras.'
            ],
            verses: [
              { reference: '2 Corintios 5:17', text: 'De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.' },
              { reference: 'Juan 1:12', text: 'Mas a todos los que le recibieron, a los que creen en su nombre, les dio potestad de ser hechos hijos de Dios.' }
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q1-1',
            type: 'fill-in-the-blank',
            prompt: 'Complete el paso fundamental de Salvación (Oseas 4:6):',
            blankTexts: ['Es vital ', ' el plan de la Salvación para no ser destruidos por falta de conocimiento.'],
            correctAnswers: ['conocer']
          },
          {
            id: 'q1-2',
            type: 'multiple-choice',
            prompt: 'Según la Guía N° 1, la salvación se recibe por:',
            options: [
              'a. Todas las buenas obras que he hecho.',
              'b. Por los sacrificios que ofrezco a mi Señor.',
              'c. Nacer en un hogar religioso que me asegura la eternidad.',
              'd. Porque todos los Domingos voy a la Iglesia, ayuno y oro.',
              'e. Por gracia, por medio de la fe en la muerte y resurrección de Jesucristo.'
            ],
            correctAnswers: ['e']
          },
          {
            id: 'q1-3',
            type: 'yes-no',
            prompt: '¿Hoy puedo testificar con seguridad que recibí al Señor en mi corazón y soy totalmente salvo?',
            options: ['Sí', 'No'],
            correctAnswers: ['Sí']
          },
          {
            id: 'q1-4',
            type: 'written',
            prompt: 'Mencione al menos tres de los privilegios o resultados que usted obtiene al recibir a Cristo Jesús (ej. perdón, paz, adopción, etc.):'
          }
        ],
        tasks: [
          'Memorizar los pasos y resultados de la Salvación indicados en la guía.',
          'Leer los capítulos de Romanos 5 y Efesios 2 de su Biblia.'
        ]
      },
      {
        id: 'guia-2',
        title: 'Guía N° 2: La Biblia',
        subtitle: 'Nuestra regla de fe y conducta',
        index: 2,
        content: [
          {
            title: 'I. SIGNIFICADO',
            paragraphs: [
              'La Biblia quiere decir "libros", proveniente del término griego "biblión". Es la recopilación de los libros sagrados inspirados por Dios para la instrucción del hombre.'
            ]
          },
          {
            title: 'II. HISTORIA Y AUTORÍA',
            paragraphs: [
              'A. Periodo de Revelación: El origen de la Biblia comienza aproximadamente 1,500 años antes de Jesucristo cuando el primer profeta/apóstol escribió su libro, y llega hasta casi el año 95 después de Jesucristo, cuando el apóstol Juan escribió el Apocalipsis. El lapso entre el primero y el último es aproximadamente de 1,600 años.',
              'B. Autor: Toda la Escritura es inspirada por Dios (2 Timoteo 3:16).',
              'C. La Biblia tiene alrededor de 40 escritores, aproximadamente, que vivieron en diferentes épocas y contextos, pero que mantuvieron perfecta armonía teológica.'
            ],
            verses: [
              { reference: '2 Timoteo 3:16', text: 'Toda la Escritura es inspirada por Dios, y útil para enseñar, para redargüir, para corregir, para instruir en justicia.' }
            ]
          },
          {
            title: 'III. ESTRUCTURA Y DIVISIONES',
            paragraphs: [
              'Se entiende por "Canon" la lista de libros sagrados o "canónicos". Sabemos que no pertenecen al canon sagrado los libros "apócrifos" o "deuterocanónicos" porque nunca fueron citados en el Nuevo Testamento por Jesús o los apóstoles.',
              'La Biblia está conformada por dos grandes Testamentos:',
              'A. El Antiguo Testamento está conformado por 39 Libros. Contiene el trato de Dios con el hombre desde la creación hasta 400 años antes de Cristo.',
              'División del Antiguo Testamento: Pentateuco (5 libros: Génesis, Éxodo, Levítico, Números, Deuteronomio), Históricos (12 libros), Poéticos (5 libros), Profetas Mayores (5 libros), Profetas Menores (12 libros).',
              'B. El Nuevo Testamento está conformado por 27 Libros. Registra el nacimiento de Juan el Bautista, la Vida y obra del Señor Jesucristo, su muerte, su resurrección, la vida de la Iglesia y su expansión por Asia y Europa, terminando con la revelación dada al apóstol Juan.',
              'División del Nuevo Testamento: Evangelios (4 libros), Libros Históricos (1 libro: Hechos), Cartas o Epístolas (21 libros: 13 cartas paulinas, 8 cartas generales), Revelación (1 libro: Apocalipsis).',
              'C. Idioma original: Los libros fueron escritos originalmente en Hebreo y Arameo (Antiguo Testamento) y en Griego (Nuevo Testamento).'
            ]
          },
          {
            title: 'IV. ¿QUÉ DEBO HACER CON LA BIBLIA?',
            paragraphs: [
              'A. Guardarla en el corazón: "En mi corazón he guardado tus dichos para no pecar contra ti" (Salmo 119:11).',
              'B. Escudriñarla: Jesús nos dice "Escudriñad las escrituras; porque a vosotros os parece que en ella tenéis la vida eterna; y ellas son las que dan testimonio de mí" (Juan 5:39).',
              'C. Meditar en ella: "En la ley de Jehová está su delicia, y en su ley medita de día y de noche" (Salmo 1:2).',
              'D. Obedecerla: "No se complace Jehová tanto en los sacrificios como en que se obedezca su Palabra" (1 Samuel 15:22). El obedecer es mejor.'
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q2-1',
            type: 'fill-in-the-blank',
            prompt: 'Complete el significado básico de la Escritura:',
            blankTexts: ['La Biblia es la ', ' de ', ' dada a la humanidad.'],
            correctAnswers: ['Palabra', 'Dios']
          },
          {
            id: 'q2-2',
            type: 'fill-in-the-blank',
            prompt: 'Complete las divisiones del canon:',
            blankTexts: ['Las Sagradas Escrituras están conformadas por dos ', ': el Antiguo y el Nuevo ', '.'],
            correctAnswers: ['Testamentos', 'Testamento']
          },
          {
            id: 'q2-3',
            type: 'multiple-choice',
            prompt: '¿Cuántos libros componen en total el Canon de la Biblia Protestante?',
            options: [
              'a. 46 libros',
              'b. 73 libros',
              'c. 66 libros (39 en el Antiguo y 27 en el Nuevo Testamento)',
              'd. 100 libros'
            ],
            correctAnswers: ['c']
          },
          {
            id: 'q2-4',
            type: 'written',
            prompt: 'Nombre en orden los primeros 5 libros de la Biblia (El Pentateuco):'
          }
        ],
        tasks: [
          'Memorizar los cinco primeros Libros del Pentateuco: Génesis, Éxodo, Levítico, Números, Deuteronomio.',
          'Comenzar a leer la Biblia diariamente en orden, sugerido empezar por el Evangelio de Juan.'
        ]
      },
      {
        id: 'guia-3',
        title: 'Guía N° 3: La Oración',
        subtitle: 'El privilegio de hablar con el Creador',
        index: 3,
        content: [
          {
            title: 'I. PRINCIPIOS DE LA ORACIÓN',
            paragraphs: [
              'La oración es el privilegio que tengo de hablar con mi Creador y Salvador. Si desarrollo una profunda relación con Él, así como el aire es para mi cuerpo, la oración es el aire para mi espíritu.',
              'A. Dios nos ordena Orar (1 Tesalonicenses 5:17; Efesios 6:18).',
              '1. Debemos aprender a orar: Los discípulos le dijeron "Señor, enséñanos a orar" (Lucas 11:1).',
              '2. Podemos y debemos orar en secreto: "Mas tú, cuando ores, entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en lo secreto" (Mateo 6:6).',
              '3. Orar con fe y sin dudar nada.',
              'B. Nuestra oración debe ser dirigida al Padre, en el nombre de Jesús Jesucristo, por la guianza del Espíritu Santo.'
            ],
            verses: [
              { reference: '1 Tesalonicenses 5:17', text: 'Orad sin cesar.' },
              { reference: 'Mateo 6:6', text: 'Mas tú, cuando ores, entra en tu aposento, y cerrada la puerta, ora a tu Padre que está en lo secreto; y tu Padre que ve en lo secreto te recompensará en público.' }
            ]
          },
          {
            title: 'II. PARTES DE LA ORACIÓN (Lucas 11:2-4)',
            paragraphs: [
              'Jesús nos dio un modelo que ilustra la estructura sana de la oración:',
              'A. Adoración y Alabanza: "Santificado sea tu nombre". Alabamos al Señor por lo que ÉL ES y por lo que ÉL HACE.',
              'B. Intercesión y Voluntad: "Venga tu reino. Hágase tu voluntad". Oramos para que la voluntad de Dios se cumpla en la tierra, en nuestras vidas, familias y naciones.',
              'C. Petición y Suministro: "El pan nuestro de cada día dánoslo hoy". Pedimos al Señor provisión física, emocional y espiritual diariamente para nuestras necesidades.',
              'D. Confesión y Perdón: "Perdónanos nuestros pecados". Debemos revisar nuestro corazón, pedir perdón a Dios y haber perdonado a quienes nos han ofendido.',
              'E. Protección y Victoria: "No nos metas en tentación, mas líbranos del mal". Buscamos que Dios nos aleje de los lazos del enemigo.'
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q3-1',
            type: 'fill-in-the-blank',
            prompt: 'Complete la dirección de la oración:',
            blankTexts: ['Nuestra oración debe ser dirigida al ', ' en el nombre de ', '.'],
            correctAnswers: ['Padre', 'Jesús']
          },
          {
            id: 'q3-2',
            type: 'multiple-choice',
            prompt: '¿Con qué frecuencia nos instruye la Escritura orar (1 Tesalonicenses 5:17)?',
            options: [
              'a. Solamente los Domingos durante la congregación.',
              'b. Una vez al año en Semana Santa.',
              'c. Orar sin cesar (mantener una actitud de comunión constante diaria).',
              'd. Únicamente cuando tenemos un problema grave.'
            ],
            correctAnswers: ['c']
          },
          {
            id: 'q3-3',
            type: 'yes-no',
            prompt: '¿Es necesario usar imágenes u otros intermediarios terrenales para que Dios escuche mi oración?',
            options: ['Sí', 'No (Jesús es nuestro único mediador ante el Padre)'],
            correctAnswers: ['No (Jesús es nuestro único mediador ante el Padre)']
          }
        ],
        tasks: [
          'Iniciar una disciplina de oración personal diaria de al menos 10 minutos por la mañana.',
          'Aprender y repasar los libros históricos del Antiguo Testamento.'
        ]
      },
      {
        id: 'guia-4',
        title: 'Guía N° 4: La Iglesia',
        subtitle: 'La comunión y cuerpo de Cristo',
        index: 4,
        content: [
          {
            title: '¿QUÉ ES LA IGLESIA?',
            paragraphs: [
              'La Iglesia es la comunidad de todos los creyentes que han recibido a Jesucristo como su salvador y son salvos por su sangre (Efesios 1:7). No representa paredes físicas o templos de ladrillos, sino vidas redimidas.',
              'La conforman los que se han separado del mundo pecaminoso por fe.',
              'La Biblia utiliza asombrosas analogías para describir la relación entre Cristo y la Iglesia:'
            ]
          },
          {
            title: 'I. RELACIONES DESCRIPTIVAS',
            paragraphs: [
              'A. COMO UN CUERPO (1 Corintios 12:12-28). El símbolo tomado aquí es el cuerpo físico. Cristo es la Cabeza y nosotros somos los miembros de ese cuerpo, organizados, útiles y cada uno ocupando su lugar.',
              'B. UN EDIFICIO Ó TEMPLO (Efesios 2:20-22). Cristo es la Piedra angular. Los creyentes somos piedras vivas que se usan en la edificación de este templo espiritual.',
              'C. LA VID VERDADERA (Juan 15:1-15). Así como los pámpanos están unidos a la vid y reciben el alimento para frutos, nosotros dependemos espiritualmente de permanecer en Cristo diariamente.'
            ]
          },
          {
            title: 'II. RAZONES PARA ASISTIR A LA IGLESIA Y BENEFICIOS',
            paragraphs: [
              'A. Mandato Divino: Por ningún motivo dejar de congregarnos como algunos tienen por costumbre, sino exhortándonos (Hebreos 10:24-25).',
              'B. Recibir la unción y refrigerio del Espíritu Santo.',
              'C. Alimentos y Crecimiento: Se recibe la Palabra que alimenta el espíritu.',
              'D. Sanidad y Restauración integral.',
              'E. Desarrollo de dones espirituales cooperativos.'
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q4-1',
            type: 'multiple-choice',
            prompt: 'Bíblicamente, ¿qué representa verdaderamente la "Iglesia"?',
            options: [
              'a. El edificio de concreto y su campanario.',
              'b. El cuerpo místico de Cristo formado por todos los creyentes redimidos.',
              'c. Un club social de fin de semana para eventos.',
              'd. Las oficinas administrativas de un concilio o denominación.'
            ],
            correctAnswers: ['b']
          },
          {
            id: 'q4-2',
            type: 'fill-in-the-blank',
            prompt: 'Complete la analogía de la Vid:',
            blankTexts: ['Nosotros somos los ', ' y debemos permanecer en Cristo, que es la ', ', para dar abundante fruto espiritual.'],
            correctAnswers: ['pámpanos', 'vid']
          }
        ],
        tasks: [
          'Comprometerse a asistir fielmente a los servicios del templo y grupos familiares.',
          'Memorizar y meditar en Hebreos 10:25.'
        ]
      },
      {
        id: 'guia-5',
        title: 'Guía N° 5: Los Sacramentos',
        subtitle: 'Ordenanzas sagradas de fe',
        index: 5,
        videoUrl: 'https://www.youtube.com/watch?v=R9L69xJ1-8U',
        content: [
          {
            title: '¿QUÉ ES UN SACRAMENTO O ORDENANZA?',
            paragraphs: [
              'Es un acto simbólico ordenado por nuestro Señor Jesucristo, que enseña una gran verdad espiritual a todos los creyentes.',
              'La Iglesia reconoce principalmente dos sacramentos u ordenanzas sagradas:'
            ]
          },
          {
            title: 'I. EL BAUTISMO EN AGUA',
            paragraphs: [
              'A. Significado: Significa "sepultura" o "sumergir" completamente en el agua. Representa la muerte del creyente al pecado (al descender al agua) y su resurrección a una vida nueva en Cristo (al salir del agua).',
              'B. Fue ordenado por Jesús mismo en la Gran Comisión (Mateo 28:19).',
              'C. Debe ser realizado en el nombre del Padre, del Hijo y del Espíritu Santo.'
            ]
          },
          {
            title: 'II. LA SANTA CENA',
            paragraphs: [
              'A. Significado: Es el memorial del sacrificio del cuerpo de Jesús (representado por el Pan sin levadura) y de su sangre derramada para el perdón de pecados (representado por el Fruto de la vid).',
              'B. Fue instituida por Jesús en la noche antes de su crucifixión (Lucas 22:19-20).',
              'C. Invita a un autoexamen espiritual antes de tomarla para no participar indignamente o negligentemente.'
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q5-1',
            type: 'multiple-choice',
            prompt: '¿Cuáles son las dos ordenanzas o sacramentos principales establecidos por Jesucristo?',
            options: [
              'a. La confirmación y la penitencia.',
              'b. El Bautismo en agua y la Santa Cena.',
              'c. El matrimonio y los funerales públicos.',
              'd. El bautismo de infantes y la ordenación pastoral.'
            ],
            correctAnswers: ['b']
          },
          {
            id: 'q5-2',
            type: 'fill-in-the-blank',
            prompt: 'Complete el significado físico del bautismo:',
            blankTexts: ['Bautizar, del griego, significa literalmente ', ' o sepultar completamente bajo el ', '.'],
            correctAnswers: ['sumergir', 'agua']
          }
        ],
        tasks: [
          'Si aún no se ha bautizado en agua, programar mentoría con el pastor para prepararse.',
          'Participar del próximo servicio de Santa Cena meditando reverentemente.'
        ]
      },
      {
        id: 'guia-6',
        title: 'Guía N° 6: Dios Moldea mi Carácter',
        subtitle: 'Formando la imagen de Cristo en nuestro caminar diario',
        index: 6,
        videoUrl: 'https://www.youtube.com/watch?v=kOnqIDyL2O0',
        content: [
          {
            title: 'I. LA PRUEBA',
            paragraphs: [
              'Es un instrumento que Dios permite en mi vida para crecer a la estatura de Cristo y purificar nuestra fe. Dios no nos tienta para el mal, pero sí prueba nuestra fidelidad ante las dificultades del camino.',
              'Aceptar la prueba con paciencia forma un carácter firme y íntegro (Santiago 1:4).'
            ],
            verses: [
              { reference: 'Génesis 22:1', text: 'Aconteció después de estas cosas, que probó Dios a Abraham...' },
              { reference: 'Santiago 1:4', text: 'Mas tenga la paciencia su obra completa, para que seáis perfectos y cabales, sin que os falte cosa alguna.' }
            ]
          },
          {
            title: 'II. LA DISCIPLINA',
            paragraphs: [
              'Todos hemos sido disciplinados por nuestros padres terrenales para nuestro bien. De la misma manera, Dios nos disciplina como hijos de forma activa para que participemos de su santidad.',
              'La disciplina produce fruto apacible de justicia a los que en ella han sido ejercitados.'
            ],
            verses: [
              { reference: 'Hebreos 12:5-6', text: 'Y habéis ya olvidado la exhortación que como a hijos se os dirige, diciendo: Hijo mío, no menosprecies la disciplina del Señor, ni desmayes cuando eres reprendido por él; porque el Señor al que ama, disciplina...' },
              { reference: 'Proverbios 3:11-12', text: 'No menosprecies, hijo mío, el castigo de Jehová, ni te fatigues de su corrección...' }
            ]
          },
          {
            title: 'III. LA TENTACIÓN',
            paragraphs: [
              'La tentación viene originalmente del enemigo (Satanás) para separar al hombre de Dios e inducirlo al pecado. Dios es fiel y no permitirá que seamos tentados más de lo que podamos resistir; siempre nos dará la oportuna salida.',
              'Jesús venció la tentación citando con autoridad las Escrituras.'
            ],
            verses: [
              { reference: '1 Corintios 10:13', text: 'No os ha sobrevenido ninguna tentación que no sea humana; pero fiel es Dios, que no os dejará ser tentados más de lo que podéis resistir, sino que dará también juntamente con la tentación la salida...' },
              { reference: 'Santiago 4:7', text: 'Someteos, pues, a Dios; resistid al diablo, y de vosotros huirá.' }
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q6-1',
            type: 'multiple-choice',
            prompt: '¿Cuál es el propósito divino de las pruebas permitidas en la vida del creyente?',
            options: [
              'a. Destruir nuestra fe por completo.',
              'b. Castigarnos sin piedad por fallas pasadas.',
              'c. Producir paciencia y formarnos perfectos y cabales en Cristo.',
              'd. Ninguna de las anteriores.'
            ],
            correctAnswers: ['c']
          },
          {
            id: 'q6-2',
            type: 'yes-no',
            prompt: '¿Permitirá Dios que seamos tentados más de lo que podemos soportar o promete darnos la salida?',
            options: ['Sí, promete darnos la salida', 'No, a veces la tentación es invencible'],
            correctAnswers: ['Sí, promete darnos la salida']
          }
        ],
        tasks: [
          'Analizar en oración qué áreas de nuestro carácter aún necesitan ser entregadas al Señor.',
          'Memorizar Santiago 1:4 y meditar en ello durante la semana.'
        ]
      },
      {
        id: 'guia-7',
        title: 'Guía N° 7: El Ayuno',
        subtitle: 'Consagración espiritual y búsqueda de la presencia de Dios',
        index: 7,
        videoUrl: 'https://www.youtube.com/watch?v=S016-D3w7tI',
        content: [
          {
            title: 'I. ¿QUÉ ES FÍSICA Y ESPIRITUALMENTE?',
            paragraphs: [
              'Físicamente, el ayuno es la abstinencia voluntaria total de alimentos por un periodo de tiempo determinado (Salmo 109:24; Éxodo 34:28).',
              'Espiritualmente, es un acto de humillación y consagración personal ante Dios para fortalecer el espíritu mediante la oración intensiva, el escudriñamiento de las Escrituras e intimidad divina (Mateo 6:16-18).'
            ],
            verses: [
              { reference: 'Mateo 6:16', text: 'Cuando ayunéis, no seáis austeros, como los hipócritas; porque ellos demudan sus rostros para mostrar a los hombres que ayunan...' },
              { reference: 'Salmo 109:24', text: 'Mis rodillas están debilitadas a causa del ayuno, y mi carne desfallece por falta de gordura.' }
            ]
          },
          {
            title: 'II. PROPÓSITOS Y BENEFICIOS DEL AYUNO',
            paragraphs: [
              'El ayuno bíblico se practica para: A. Conocer la voluntad de Dios en decisiones críticas (Hechos 13:2-3). B. Humillarse ante el Creador (Salmos 35:13). C. Romper fortalezas y yugos generacionales de impiedad (Isaías 58:6). D. Clamar por salvación de amigos y familias descarriadas.',
              'Anexo N° 1 de Ceremonias: Presentación de niños, Bautismo en agua, Matrimonios, Recepción de nuevos miembros, Santa Cena, Funerales, Dedicación del Templo, Ordenación de Ministros.'
            ],
            verses: [
              { reference: 'Isaías 58:6', text: '¿No es más bien el ayuno que yo escogí, desatar las ligaduras de impiedad, soltar las cargas de opresión, y dejar libres a los quebrantados...?' }
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q7-1',
            type: 'multiple-choice',
            prompt: '¿Cómo se define espiritualmente el ayuno bíblico según Mateo 6:16-18?',
            options: [
              'a. Una huelga de hambre para obligar a Dios a darnos dinero.',
              'b. Una dieta física para mejorar la figura.',
              'c. Un tiempo de humillación y oración ferviente para fortalecer nuestro espíritu.',
              'd. Ninguna de las anteriores.'
            ],
            correctAnswers: ['c']
          },
          {
            id: 'q7-2',
            type: 'yes-no',
            prompt: '¿Es el ayuno un medio bíblico importante para buscar la dirección de Dios?',
            options: ['Sí', 'No'],
            correctAnswers: ['Sí']
          }
        ],
        tasks: [
          'Planificar un día de ayuno (medio día o completo) con el propósito exclusivo de buscar el fortalecimiento espiritual.',
          'Estudiar el Anexo N° 1 de ceremonias eclesiásticas en la guía.'
        ]
      },
      {
        id: 'guia-8',
        title: 'Guía N° 8: Las Sectas e Idolatría',
        subtitle: 'Defendiendo la Sana Doctrina del Templo',
        index: 8,
        videoUrl: 'https://www.youtube.com/watch?v=F0O5Q9AOMsc',
        content: [
          {
            title: 'I. DEFINICIÓN DE SECTA Y FALSA DOCTRINA',
            paragraphs: [
              'Una secta es una organización o grupo de personas que, profesando seguir a Dios o las Escrituras, tuercen y modifican las verdades fundamentales de la Biblia y del evangelio directo de Jesucristo (Gálatas 1:8).',
              'Cómo identificarlos: 1) No aceptan la Biblia como única y suficiente regla de fe y conducta. 2) Niegan que la deidad de Jesucristo o su sacrificio consumado sea suficiente por sí solo para la salvación. 3) Añaden obras de su propia organización como requisito obligatorio para salvarse (Efesios 2:8-9).'
            ],
            verses: [
              { reference: 'Gálatas 1:8', text: 'Mas si aun nosotros, o un ángel del cielo, os anunciare otro evangelio diferente del que os hemos anunciado, sea anatema.' },
              { reference: 'Efesios 2:8-9', text: 'Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios; no por obras, para que nadie se gloríe.' }
            ]
          },
          {
            title: 'II. LA IDOLATRÍA Y REFUTACIÓN BÍBLICA',
            paragraphs: [
              'La idolatría es rendir culto, venerar o adorar imágenes, representaciones o cualquier objeto/persona creado antes que al Dios Único y Verdadero (Éxodo 20:4-5; Salmo 115:4-8).',
              'Anexo N° 2 (Cuadro Sectas): Testigos de Jehová (niegan la Trinidad), Mormones (añaden El Libro de Mormón), Satanismo (niegan a Jesús), Adventistas (insisten en guardar el sábado para salvarse), Catolicismo (veneración y tradición humana que altera el evangelio original).'
            ],
            verses: [
              { reference: 'Éxodo 20:4-5', text: 'No te harás imagen, ni ninguna semejanza de lo que esté arriba en el cielo, ni abajo en la tierra, ni en las aguas debajo de la tierra. No te inclinarás a ellas, ni las honrarás...' },
              { reference: 'Salmo 115:4-8', text: 'Los ídolos de ellos son plata y oro, obra de manos de hombres. Tienen boca, mas no hablan; tienen ojos, mas no ven; orejas tienen, mas no oyen... Semejantes a ellos son los que los hacen...' }
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q8-1',
            type: 'multiple-choice',
            prompt: '¿Qué nos enseña el Salmo 115 sobre los ídolos fabricados por manos humanas?',
            options: [
              'a. Tienen poder real para sanar y oír.',
              'b. Tienen boca pero no hablan, ojos pero no ven; y semejante a ellos son los que los hacen.',
              'c. Es lícito adorarlos si representan a un santo.',
              'd. Representan un canal sagrado aprobado por Dios.'
            ],
            correctAnswers: ['b']
          },
          {
            id: 'q8-2',
            type: 'yes-no',
            prompt: '¿Viene la salvación por gracia mediante la fe en Jesús, o por pertenecer estrictamente a obras humanas?',
            options: ['Únicamente por gracia mediante la fe en Cristo Jesús', 'Por cumplir obras externas e imposiciones de hombres'],
            correctAnswers: ['Únicamente por gracia mediante la fe en Cristo Jesús']
          }
        ],
        tasks: [
          'Revisar con minuciosidad el Anexo N° 2 (Cuadro Sectas) para aprender a refutar con la palabra sus dudas.',
          'Asegurar que nuestro corazón no tenga ídolos ocultos (bienes, orgullo, tiempo) que ocupen el lugar de Dios.'
        ]
      },
      {
        id: 'guia-9',
        title: 'Guía N° 9: Compartir a otros el Evangelio',
        subtitle: 'Haciendo discípulos bajo el mandato de la Gran Comisión',
        index: 9,
        videoUrl: 'https://www.youtube.com/watch?v=S0TbyuE-0A4',
        content: [
          {
            title: 'I. ¿QUÉ ES EL EVANGELIO?',
            paragraphs: [
              'El Evangelio significa literalmente "Buenas Nuevas". Es la historia redentora del amor de Dios manifestado en el nacimiento, vida perfecta, muerte sacrificial, sepultura y resurrección victoriosa de nuestro Señor Jesucristo (Romanos 1:16; 1 Corintios 15:3-4).',
              'El plan de salvación es universal y está plenamente disponible para todo aquel que cree.'
            ],
            verses: [
              { reference: 'Romanos 1:16', text: 'Porque no me avergüenzo del evangelio, porque es poder de Dios para salvación a todo aquel que cree...' },
              { reference: '1 Corintios 15:3-4', text: 'Porque primeramente os he enseñado lo que asimismo recibí: Que Cristo murió por nuestros pecados, conforme a las Escrituras; y que fue sepultado, y que resucitó al tercer día...' }
            ]
          },
          {
            title: 'II. EL MANDATO Y LA DOCTRINA',
            paragraphs: [
              'Compartir el evangelio es un mandato solemne entregado directamente por Jesús (Mateo 28:19; Marcos 16:15). Debemos testificar con gozo sincero de nuestra transformación espiritual y llevar esperanza.',
              'Anexo N° 3 (Doctrina de las Asambleas de Dios): Creemos firmemente en el poder inspirador de las Escrituras, el Único Dios Verdadero (Trinidad), la Deidad del Señor Jesucristo, la Salvación completa por gracia de fe, las ceremonias del bautismo y Santa Cena, y el ministerio guiado por el Espíritu Santo en el Perú.'
            ],
            verses: [
              { reference: 'Marcos 16:15', text: 'Y les dijo: Id por todo el mundo y predicad el evangelio a toda criatura.' }
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q9-1',
            type: 'multiple-choice',
            prompt: '¿Cuál es el mandato explícito de la Gran Comisión dada por Jesús en Mateo 28:19?',
            options: [
              'a. Quedarse en los templos callados sin enseñar.',
              'b. Id y haced discípulos a todas las naciones, bautizándolos.',
              'c. Tratar de forzar religiosamente a todos usando dinero.',
              'd. Ninguna de las anteriores.'
            ],
            correctAnswers: ['b']
          },
          {
            id: 'q9-2',
            type: 'yes-no',
            prompt: '¿Sientes el compromiso gozoso de testificar sobre Cristo a tu círculo cercano?',
            options: ['Sí', 'No'],
            correctAnswers: ['Sí']
          }
        ],
        tasks: [
          'Conversar con al menos una persona este mes para compartirle de qué manera Jesús cambió tu vida.',
          'Estudiar las 16 Verdades Fundamentales del Anexo 3 de nuestro instituto.'
        ]
      },
      {
        id: 'guia-10',
        title: 'Guía N° 10: Mayordomía Cristiana',
        subtitle: 'Administrando la obra y recursos de Dios con integridad',
        index: 10,
        videoUrl: 'https://www.youtube.com/watch?v=F5D5Xp1lpxo',
        content: [
          {
            title: 'I. CONCEPTO DE MAYORDOMO',
            paragraphs: [
              'En el Nuevo Testamento, mayordomo proviene de "oikonomia", que significa literalmente "administrador de una casa" (Lucas 16:2). El mayordomo no es el dueño personal, sino el encargado de cuidar y multiplicar con fidelidad los bienes que le pertenecen por completo a su señor.',
              'Todo lo que somos y poseemos (vida, salud, tiempo, finanzas, talentos, familia) es propiedad absoluta del Creador (Salmos 24:1).'
            ],
            verses: [
              { reference: 'Lucas 16:2', text: '...Da cuenta de tu mayordomía, porque ya no podrás más ser mayordomo.' },
              { reference: 'Salmo 24:1', text: 'De Jehová es la tierra y su plenitud; el mundo, y los que en él habitan.' }
            ]
          },
          {
            title: 'II. DIEZMOS Y OFRENDAS COMO ACTO DE ADORACIÓN',
            paragraphs: [
              'La mayordomía financiera incluye consagrar el 10% (diezmo) de nuestros ingresos a Dios para sostener activamente el templo y las misiones evangelizadoras (Malaquías 3:10).',
              'Ofrendar es un acto libre basado en la generosidad y el gozo de dar con gratitud al dador alegre (2 Corintios 9:7).'
            ],
            verses: [
              { reference: 'Malaquías 3:10', text: 'Traed todos los diezmos al alfolí y haya alimento en mi casa; y probadme ahora en esto, dice Jehová de los ejércitos, si no os abriré las ventanas de los cielos, y derramaré sobre vosotros bendición hasta que sobreabunde.' },
              { reference: '2 Corintios 9:7', text: 'Cada uno dé como propuso en su corazón; no con tristeza, ni por necesidad, porque Dios ama al dador alegre.' }
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q10-1',
            type: 'multiple-choice',
            prompt: '¿Qué significa ser un buen mayordomo cristiano frente a los bienes mundanos?',
            options: [
              'a. Creer que somos dueños eternos de todo.',
              'b. Ser un administrador fiel de la vida, tiempo y finanzas que pertenecen enteramente a Dios.',
              'c. Acumular egoístamente sin diezmar ni ofrendar con gozo.',
              'd. Desatender las necesidades de la congregación local.'
            ],
            correctAnswers: ['b']
          },
          {
            id: 'q10-2',
            type: 'fill-in-the-blank',
            prompt: 'Complete la promesa de Malaquías 3:10:',
            blankTexts: ['Traed todos los diezmos al ', ' para que haya alimento en mi casa y probar mi bendición celestial.'],
            correctAnswers: ['alfolí']
          }
        ],
        tasks: [
          'Hacer un inventario de nuestro tiempo semanal para asegurar que dedicamos porciones diarias de devoción.',
          'Organizar nuestras finanzas personales decidiendo honrar a Dios con primicias, ofrendas y diezmos.'
        ]
      },
      {
        id: 'guia-11',
        title: 'Guía N° 11: El Arrebatamiento y Segunda Venida',
        subtitle: 'La bendita esperanza de nuestra redención definitiva',
        index: 11,
        videoUrl: 'https://www.youtube.com/watch?v=FjIAdt4Y9vE',
        content: [
          {
            title: 'I. EL ARREBATAMIENTO (EL RAPTO)',
            paragraphs: [
              'El arrebatamiento es el acontecimiento glorioso e inminente en el cual Jesucristo descenderá de los cielos en las nubes para llevarse a su Novia (la Iglesia fiel santificada) antes de los juicios severos de la tierra (1 Tesalonicenses 4:16-17; 1 Corintios 15:51-54).',
              'Los muertos en Cristo resucitarán primero y los que estemos vivos seremos transformados con un cuerpo incorruptible glorioso en un abrir y cerrar de ojos.',
              'Anexo N° 4 (Eventos Futuros): Describe el Rapto de la Iglesia, el Tribunal de Cristo, las Bodas del Cordero y la gran tribulación en la tierra.'
            ],
            verses: [
              { reference: '1 Tesalonicenses 4:16-17', text: 'Porque el Señor mismo con voz de mando, con voz de arcángel, y con trompeta de Dios, descenderá del cielo; y los muertos en Cristo resucitarán primero. Luego nosotros los que vivimos, los que hayamos quedado, seremos arrebatados juntamente con ellos...' },
              { reference: '1 Corintios 15:51-52', text: 'He aquí, os digo un misterio: No todos dormiremos; pero todos seremos transformados, en un momento, en un abrir y cerrar de ojos, a la final trompeta...' }
            ]
          },
          {
            title: 'II. LA SEGUNDA VENIDA EN GLORIA Y NUESTRO ORIGEN',
            paragraphs: [
              'La Segunda Venida visible representa el retorno de Cristo al final de la Tribulación con poder, majestad y con su Iglesia triunfante para juzgar a las naciones vivas, encadenar temporalmente a Satanás por mil años (Milenio) y establecer paz universal.',
              'Anexo N° 5: Narra los anales históricos del origen espiritual de "Las Asambleas de Dios" como parte del gran avivamiento carismático del siglo XX.'
            ],
            verses: [
              { reference: 'Mateo 24:30', text: 'Entonces aparecerá la señal del Hijo del Hombre en el cielo; y entonces lamentarán todas las tribus de la tierra, y verán al Hijo del Hombre viniendo sobre las nubes del cielo, con poder y gran gloria.' }
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'q11-1',
            type: 'multiple-choice',
            prompt: '¿Qué distingue al Arrebatamiento (Rapto) de la Segunda Venida visible de Cristo en gloria?',
            options: [
              'a. El arrebatamiento ocurre en secreto en las nubes para salvaguardar a la iglesia, mientras que en la Segunda Venida todo ojo le verá descendiendo en la tierra.',
              'b. Son exactamente el mismo evento en el mismo microsegundo del reloj humano.',
              'c. Ambos eventos son meras leyendas sin asidero canónico.',
              'd. Ninguna de las anteriores.'
            ],
            correctAnswers: ['a']
          },
          {
            id: 'q11-2',
            type: 'yes-no',
            prompt: '¿Nos exhorta este acontecimiento futuro a vivir limpios, en santidad y con un corazón consagrado?',
            options: ['Sí, en vela y santidad práctica', 'No, no importa cómo vivamos'],
            correctAnswers: ['Sí, en vela y santidad práctica']
          }
        ],
        tasks: [
          'Leer despacio Mateo 24 y 25 completos, meditando en las parábolas de las vírgenes y los talentos.',
          'Consagrar tu corazón diariamente al Señor reconociendo su inminente venida por nosotros.'
        ]
      }
    ]
  },
  {
    id: 'liderazgo-cristiano',
    title: 'Liderazgo de Excelencia',
    subtitle: 'Principios de Carácter y Servicio',
    description: 'Curso de capacitación para el servicio en la iglesia local, cubriendo la integridad del líder, la mayordomía de talentos y el llamado a discipular a otros.',
    category: 'Liderazgo',
    author: 'Escuela de Liderazgo',
    duration: '4 Lecciones',
    logoColor: 'from-blue-600 to-indigo-800',
    iconName: 'users',
    lessons: [
      {
        id: 'lid-1',
        title: 'Lección 1: El Carácter del Líder',
        subtitle: 'La integridad como base irremplazable',
        index: 1,
        content: [
          {
            title: 'El Fundamento del Servicio',
            paragraphs: [
              'El liderazgo cristiano no se basa en el carisma o las habilidades organizacionales, sino en el carácter cristocéntrico refinado a través de la obediencia y la disciplina.',
              'Un líder aprobado por Dios busca glorificar al Señor en su vida privada tanto como en su labor pública. La integridad es hacer lo correcto aun cuando nadie nos está observando.'
            ],
            verses: [
              { reference: '1 Timoteo 3:2', text: 'Pero es necesario que el obispo sea irreprensible, marido de una sola mujer, sobrio, prudente, decoroso, hospedador, apto para enseñar...' }
            ]
          }
        ],
        reviewQuestions: [
          {
            id: 'qlid-1',
            type: 'multiple-choice',
            prompt: '¿Cuál es el verdadero cimiento del liderazgo según la Escritura?',
            options: [
              'a. El talento oratorio exclusivo.',
              'b. El dinero e influencia social.',
              'c. El carácter íntegro alineado al fruto del Espíritu Santo.',
              'd. La antigüedad cronológica en un templo.'
            ],
            correctAnswers: ['c']
          }
        ]
      }
    ]
  }
];

export const RELIGIOUS_COMPARISONS = [
  {
    name: 'Testigos de Jehová',
    founder: 'Carlos Taze Russell (1872)',
    salvation: 'Por obras y venta de folletos de Atalaya.',
    jesus: 'La primera criatura creada por Dios (el Arcángel Miguel).',
    authority: 'La sociedad Watchtower. Traducción del Nuevo Mundo.',
    refutation: 'Deuteronomio 18:22, Apocalipsis 22:19'
  },
  {
    name: 'Mormones (SUD)',
    founder: 'José Smith',
    salvation: 'Depende de las obras de la persona y membresía.',
    jesus: 'Hijo de Dios-Adán y de María, hermano de Luzbel.',
    authority: 'El libro de Mormón. Doctrina y Convenios.',
    refutation: 'Gálatas 1:8, Apocalipsis 22:18'
  },
  {
    name: 'Satanismo',
    founder: 'Antón La Vey',
    salvation: 'Placer propio. Reencarnación o infierno eterno.',
    jesus: 'Ser inferior a Satanás. Afirman que es igual al hombre.',
    authority: 'La Biblia Satánica.',
    refutation: 'Apocalipsis 20:10, Mateo 4:10'
  },
  {
    name: 'Iglesia Católica',
    founder: 'Constantino / Evolución histórica',
    salvation: 'Fe, sacramentos, penitencias, obras.',
    jesus: 'El Verdadero Hijo de Dios salvador.',
    authority: 'La Biblia, el Papa y la Tradición.',
    refutation: 'Efesios 2:8-9, 1 Timoteo 2:5'
  }
];
