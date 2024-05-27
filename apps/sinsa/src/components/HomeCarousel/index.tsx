import { Button, Card, Carousel, Typography } from 'antd';
import { Link } from '@modern-js/runtime/router';
import type { HomeCarouselDataType } from './types';
import { VIDEO_WIDTH } from './constants';

interface HomeCarouselProps {
  dataSource: HomeCarouselDataType[];
  className?: string;
  style?: React.CSSProperties;
}

const IMAGE_STYLE: React.CSSProperties = {
  objectFit: 'cover',
  background: 'gray',
};

export const HomeCarousel: React.FC<HomeCarouselProps> = ({
  dataSource,
  className,
  style,
}) => {
  return (
    <Carousel
      autoplay
      arrows
      dotPosition="top"
      className={className}
      style={style}
    >
      {dataSource.map(card => {
        return (
          <Card
            key={card.key}
            cover={
              card.backgroundURL ? (
                <img
                  style={IMAGE_STYLE}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  width={VIDEO_WIDTH}
                  height={VIDEO_WIDTH / (320 / 200)}
                  src={card.backgroundURL}
                />
              ) : null
            }
          >
            <Card.Meta
              title={card.title}
              description={
                <Typography.Paragraph>{card.description}</Typography.Paragraph>
              }
            />
            <Link to={card.link} target="_blank">
              <Button type="primary" ghost icon={card.labelIcon}>
                {card.label}
              </Button>
            </Link>
          </Card>
        );
      })}
    </Carousel>
  );
};
