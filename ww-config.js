export default {
  editor: {
    label: {
      en: 'Carousel',
      fr: 'Carrousel'
    },
    icon: 'image'
  },
  triggerEvents: [
    {
      name: 'slide-change',
      label: { en: 'On slide change', fr: 'Au changement de slide' },
      event: {
        index: 0,
        slide: {},
        total: 0
      }
    },
    {
      name: 'slide-click',
      label: { en: 'On slide click', fr: 'Au clic sur slide' },
      event: {
        slide: {},
        index: 0
      }
    },
    {
      name: 'slide-action',
      label: { en: 'On slide action', fr: 'À l\'action de slide' },
      event: {
        slide: {},
        index: 0,
        action: ''
      }
    }
  ],
  properties: {
    height: {
      label: { en: 'Height', fr: 'Hauteur' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'sm', label: { en: 'Small (192px)', fr: 'Petit (192px)' } },
          { value: 'md', label: { en: 'Medium (256px)', fr: 'Moyen (256px)' } },
          { value: 'lg', label: { en: 'Large (320px)', fr: 'Grand (320px)' } },
          { value: 'xl', label: { en: 'Extra Large (384px)', fr: 'Très grand (384px)' } }
        ]
      },
      defaultValue: 'md',
      bindable: true
    },
    autoPlay: {
      label: { en: 'Auto play', fr: 'Lecture automatique' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true
    },
    autoPlayInterval: {
      label: { en: 'Auto play interval (ms)', fr: 'Intervalle de lecture auto (ms)' },
      type: 'Number',
      defaultValue: 3000,
      bindable: true
    },
    pauseOnHover: {
      label: { en: 'Pause on hover', fr: 'Pause au survol' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
    loop: {
      label: { en: 'Loop', fr: 'Boucle' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
    showArrows: {
      label: { en: 'Show arrows', fr: 'Afficher les flèches' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
    showIndicators: {
      label: { en: 'Show indicators', fr: 'Afficher les indicateurs' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
    showThumbnails: {
      label: { en: 'Show thumbnails', fr: 'Afficher les miniatures' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true
    },
    showPlayPause: {
      label: { en: 'Show play/pause button', fr: 'Afficher le bouton play/pause' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true
    },
    slides: {
      label: { en: 'Slides', fr: 'Diapositives' },
      type: 'Array',
      options: {
        item: {
          type: 'Object',
          options: {
            item: {
              id: {
                label: { en: 'ID', fr: 'ID' },
                type: 'Text',
                bindable: true
              },
              type: {
                label: { en: 'Slide type', fr: 'Type de diapositive' },
                type: 'TextSelect',
                options: {
                  options: [
                    { value: 'image', label: { en: 'Image', fr: 'Image' } },
                    { value: 'video', label: { en: 'Video', fr: 'Vidéo' } },
                    { value: 'content', label: { en: 'Content', fr: 'Contenu' } }
                  ]
                },
                defaultValue: 'image',
                bindable: true
              },
              src: {
                label: { en: 'Source URL', fr: 'URL source' },
                type: 'Text',
                bindable: true
              },
              alt: {
                label: { en: 'Alt text', fr: 'Texte alternatif' },
                type: 'Text',
                bindable: true
              },
              title: {
                label: { en: 'Title', fr: 'Titre' },
                type: 'Text',
                bindable: true
              },
              description: {
                label: { en: 'Description', fr: 'Description' },
                type: 'Text',
                bindable: true
              },
              htmlContent: {
                label: { en: 'HTML content', fr: 'Contenu HTML' },
                type: 'LongText',
                bindable: true
              },
              thumbnail: {
                label: { en: 'Thumbnail URL', fr: 'URL de miniature' },
                type: 'Text',
                bindable: true
              },
              overlay: {
                label: { en: 'Show overlay', fr: 'Afficher superposition' },
                type: 'OnOff',
                defaultValue: false,
                bindable: true
              },
              actionLabel: {
                label: { en: 'Action button label', fr: 'Label du bouton d\'action' },
                type: 'Text',
                bindable: true
              },
              actionVariant: {
                label: { en: 'Action button variant', fr: 'Variante du bouton d\'action' },
                type: 'TextSelect',
                options: {
                  options: [
                    { value: 'default', label: { en: 'Default', fr: 'Par défaut' } },
                    { value: 'outline', label: { en: 'Outline', fr: 'Contour' } },
                    { value: 'secondary', label: { en: 'Secondary', fr: 'Secondaire' } },
                    { value: 'ghost', label: { en: 'Ghost', fr: 'Fantôme' } }
                  ]
                },
                defaultValue: 'default',
                bindable: true
              },
              showControls: {
                label: { en: 'Show video controls', fr: 'Afficher contrôles vidéo' },
                type: 'OnOff',
                defaultValue: true,
                bindable: true
              },
              autoplay: {
                label: { en: 'Video autoplay', fr: 'Lecture auto vidéo' },
                type: 'OnOff',
                defaultValue: false,
                bindable: true
              },
              muted: {
                label: { en: 'Video muted', fr: 'Vidéo muette' },
                type: 'OnOff',
                defaultValue: true,
                bindable: true
              },
              loop: {
                label: { en: 'Video loop', fr: 'Vidéo en boucle' },
                type: 'OnOff',
                defaultValue: false,
                bindable: true
              },
              imageClass: {
                label: { en: 'Image CSS class', fr: 'Classe CSS image' },
                type: 'Text',
                bindable: true
              },
              videoClass: {
                label: { en: 'Video CSS class', fr: 'Classe CSS vidéo' },
                type: 'Text',
                bindable: true
              },
              contentClass: {
                label: { en: 'Content CSS class', fr: 'Classe CSS contenu' },
                type: 'Text',
                bindable: true
              },
              contentStyle: {
                label: { en: 'Content style', fr: 'Style contenu' },
                type: 'Text',
                bindable: true
              },
              overlayClass: {
                label: { en: 'Overlay CSS class', fr: 'Classe CSS superposition' },
                type: 'Text',
                bindable: true
              }
            }
          }
        }
      },
      defaultValue: [
        {
          id: '1',
          type: 'image',
          src: 'https://via.placeholder.com/800x400',
          alt: 'Slide 1',
          title: 'First Slide',
          description: 'This is the first slide'
        },
        {
          id: '2',
          type: 'image',
          src: 'https://via.placeholder.com/800x400/0066cc',
          alt: 'Slide 2',
          title: 'Second Slide',
          description: 'This is the second slide'
        },
        {
          id: '3',
          type: 'content',
          title: 'Custom Content',
          description: 'This slide contains custom content',
          actionLabel: 'Learn More',
          actionVariant: 'default'
        }
      ],
      bindable: true
    },
    customClass: {
      label: { en: 'Custom CSS class', fr: 'Classe CSS personnalisée' },
      type: 'Text',
      bindable: true
    },
    customStyle: {
      label: { en: 'Custom style', fr: 'Style personnalisé' },
      type: 'Text',
      bindable: true
    }
  }
} 