
import React from 'react';
import { VitalSign, TrendDirection } from '../types';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, HeartIcon, ThermometerIcon, LungIcon, GaugeIcon } from './icons';

interface VitalSignCardProps {
  vital: VitalSign;
}

const TrendIcon: React.FC<{ trend?: TrendDirection }> = ({ trend }) => {
  if (trend === 'up') return <ArrowUpIcon className="w-5 h-5 text-red-500" />;
  if (trend === 'down') return <ArrowDownIcon className="w-5 h-5 text-blue-500" />;
  return <MinusIcon className="w-5 h-5 text-gray-500" />;
};

const VitalIcon: React.FC<{ name: string }> = ({ name }) => {
  const commonClasses = "w-7 h-7 text-sky-600";
  if (name.includes('Heart Rate')) return <HeartIcon className={commonClasses} />;
  if (name.includes('Temperature')) return <ThermometerIcon className={commonClasses} />;
  if (name.includes('Oxygen Saturation')) return <LungIcon className={commonClasses} />;
  if (name.includes('Blood Pressure')) return <GaugeIcon className={commonClasses} />;
  return <InfoIcon className={commonClasses} />; // Fallback icon
};

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Simple fallback
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);


const VitalSignCard: React.FC<VitalSignCardProps> = ({ vital }) => {
  let valueColor = 'text-slate-800';
  if (vital.trend === 'up' && (vital.name === 'Heart Rate' || vital.name === 'Temperature' || vital.name.includes('Pressure'))) valueColor = 'text-red-600';
  if (vital.trend === 'down' && (vital.name === 'Heart Rate' || vital.name === 'Temperature' || vital.name.includes('Pressure') || vital.name === 'Oxygen Saturation')) valueColor = 'text-blue-600';
  if (vital.name === 'Oxygen Saturation' && typeof vital.value === 'number' && vital.value < 95) valueColor = 'text-orange-600';


  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <VitalIcon name={vital.name} />
          <h4 className="text-sm font-semibold text-slate-600 ml-2">{vital.name}</h4>
        </div>
        <TrendIcon trend={vital.trend} />
      </div>
      <p className={`text-2xl font-bold ${valueColor}`}>
        {vital.value} <span className="text-sm font-normal text-slate-500">{vital.unit}</span>
      </p>
      {vital.normalRange && (
        <p className="text-xs text-slate-400 mt-1">Normal: {vital.normalRange}</p>
      )}
      <p className="text-xs text-slate-400 mt-1">
        Last updated: {new Date(vital.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default VitalSignCard;
