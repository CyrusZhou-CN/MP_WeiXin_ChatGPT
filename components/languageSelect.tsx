import React from 'react';
import Select, { OptionsOrGroups } from 'react-select';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import cnFlag from '/public/images/cn.png';
import itFlag from '/public/images/it.png';
import enFlag from '/public/images/en.png';

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderRadius: 0,
    border: 'none',
    boxShadow: 'none',
    '&  div ': {
      display: 'flex',
      alignItems: 'center',
      '& > img': {
        marginRight: '5px',
        marginLeft: '10px',
      },
    },
    backgroundColor: 'transparent',
    '&:hover': {
      cursor: 'pointer',
    },
  }),
  indicatorSeparator: (provided: any) => ({
    ...provided,
    display: 'none',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#666',
    display: 'flex',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      color: '#87CEEB',
    },
    color: state.isSelected ? '#FFA500' : '#333', // 修改选中项字体颜色为黑色
    backgroundColor: state.isFocused ? '#f0f8ff' : 'transparent',
    '& > img': {
      marginRight: '5px',
      marginLeft: '10px',
    },
  })
};

interface LanguageSelectProps {
  className?: string;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ className }) => {
  const { t, i18n } = useTranslation();

  const options: OptionsOrGroups<string, any> = [
    {
      value: 'cn',
      label: (
        <>
          <Image src={cnFlag} width={40} alt={t('chinese')} />
          {t('chinese')}
        </>
      ),
    },
    {
      value: 'it',
      label: (
        <>
          <Image src={itFlag} width={40} alt={t('italian')} />
          {t('italian')}
        </>
      ),
    },
    {
      value: 'en',
      label: (
        <>
          <Image src={enFlag} width={40} alt={t('english')} />
          {t('english')}
        </>
      ),
    },
  ];

  return (
    <nav>
      <Select
        className={className}
        options={options}
        value={options.find((option) => option.value === i18n.language)}
        onChange={(option) => i18n.changeLanguage(option?.value)}
        styles={customStyles}
        isSearchable={false}
      />
    </nav>
  );
};

export default LanguageSelect;
