PGDMP                  
    |            Aplikasi    16.4    16.4 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16526    Aplikasi    DATABASE     �   CREATE DATABASE "Aplikasi" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Indonesian_Indonesia.1252';
    DROP DATABASE "Aplikasi";
                postgres    false            �            1259    16605    admin_report    TABLE     8  CREATE TABLE public.admin_report (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    name_admin character varying(255),
    file_admin character varying(255),
    mime_admin character varying(255)
);
     DROP TABLE public.admin_report;
       public         heap    postgres    false            �            1259    16604    admin_report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.admin_report_id_seq;
       public          postgres    false    222            �           0    0    admin_report_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.admin_report_id_seq OWNED BY public.admin_report.id;
          public          postgres    false    221                       1259    16926    alat    TABLE     W   CREATE TABLE public.alat (
    id integer NOT NULL,
    alat character varying(100)
);
    DROP TABLE public.alat;
       public         heap    postgres    false                        1259    16925    alat_id_seq    SEQUENCE     �   CREATE SEQUENCE public.alat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.alat_id_seq;
       public          postgres    false    257            �           0    0    alat_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.alat_id_seq OWNED BY public.alat.id;
          public          postgres    false    256            �            1259    16662    barcode_kontraktor    TABLE       CREATE TABLE public.barcode_kontraktor (
    id integer NOT NULL,
    jabatan character varying(100),
    nama character varying(100),
    nip character varying(50),
    name character varying(255),
    file_path character varying(255),
    mime_type character varying(255)
);
 &   DROP TABLE public.barcode_kontraktor;
       public         heap    postgres    false            �            1259    16661    barcode_kontraktor_id_seq    SEQUENCE     �   CREATE SEQUENCE public.barcode_kontraktor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.barcode_kontraktor_id_seq;
       public          postgres    false    230            �           0    0    barcode_kontraktor_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.barcode_kontraktor_id_seq OWNED BY public.barcode_kontraktor.id;
          public          postgres    false    229            �            1259    16653    barcode_pengawas    TABLE       CREATE TABLE public.barcode_pengawas (
    id integer NOT NULL,
    jabatan character varying(100),
    nama character varying(100),
    nip character varying(50),
    name character varying(255),
    file_path character varying(255),
    mime_type character varying(255)
);
 $   DROP TABLE public.barcode_pengawas;
       public         heap    postgres    false            �            1259    16652    barcode_pengawas_id_seq    SEQUENCE     �   CREATE SEQUENCE public.barcode_pengawas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.barcode_pengawas_id_seq;
       public          postgres    false    228            �           0    0    barcode_pengawas_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.barcode_pengawas_id_seq OWNED BY public.barcode_pengawas.id;
          public          postgres    false    227            �            1259    16843    cache    TABLE     �   CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration integer NOT NULL
);
    DROP TABLE public.cache;
       public         heap    postgres    false            �            1259    16850    cache_locks    TABLE     �   CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration integer NOT NULL
);
    DROP TABLE public.cache_locks;
       public         heap    postgres    false            �            1259    16689 	   equipment    TABLE     �   CREATE TABLE public.equipment (
    id integer NOT NULL,
    equipment character varying(200),
    tipe_unit character varying(200)
);
    DROP TABLE public.equipment;
       public         heap    postgres    false            �            1259    16688    equipment_id_seq    SEQUENCE     �   CREATE SEQUENCE public.equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.equipment_id_seq;
       public          postgres    false    232            �           0    0    equipment_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.equipment_id_seq OWNED BY public.equipment.id;
          public          postgres    false    231            �            1259    16919    executor    TABLE     _   CREATE TABLE public.executor (
    id integer NOT NULL,
    executor character varying(100)
);
    DROP TABLE public.executor;
       public         heap    postgres    false            �            1259    16918    executor_id_seq    SEQUENCE     �   CREATE SEQUENCE public.executor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.executor_id_seq;
       public          postgres    false    255            �           0    0    executor_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.executor_id_seq OWNED BY public.executor.id;
          public          postgres    false    254            �            1259    16875    failed_jobs    TABLE     &  CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE public.failed_jobs;
       public         heap    postgres    false            �            1259    16874    failed_jobs_id_seq    SEQUENCE     {   CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.failed_jobs_id_seq;
       public          postgres    false    247            �           0    0    failed_jobs_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;
          public          postgres    false    246            �            1259    16905    grup    TABLE     W   CREATE TABLE public.grup (
    id integer NOT NULL,
    grup character varying(100)
);
    DROP TABLE public.grup;
       public         heap    postgres    false            �            1259    16904    grup_id_seq    SEQUENCE     �   CREATE SEQUENCE public.grup_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.grup_id_seq;
       public          postgres    false    251            �           0    0    grup_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.grup_id_seq OWNED BY public.grup.id;
          public          postgres    false    250            �            1259    16548    hourmeter_report    TABLE       CREATE TABLE public.hourmeter_report (
    id integer NOT NULL,
    operation_report_id integer NOT NULL,
    equipment character varying(100) NOT NULL,
    hm_awal double precision NOT NULL,
    hm_akhir double precision NOT NULL,
    jam_lain double precision NOT NULL,
    breakdown double precision NOT NULL,
    no_operator double precision NOT NULL,
    hujan double precision NOT NULL,
    ket character varying(100) NOT NULL,
    proses_admin character varying(255) DEFAULT ''::character varying,
    proses_pengawas character varying(255) DEFAULT NULL::character varying,
    proses_kontraktor character varying(255) DEFAULT NULL::character varying,
    alasan_reject character varying(255),
    tipe_unit character varying(255),
    total_hm double precision,
    jam_operasi double precision,
    no_order double precision,
    kontraktor character varying(200),
    name_pengawas character varying(200),
    file_pengawas character varying(200),
    name_kontraktor character varying(200),
    file_kontraktor character varying(200)
);
 $   DROP TABLE public.hourmeter_report;
       public         heap    postgres    false            �            1259    16547    hourmeter_report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.hourmeter_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.hourmeter_report_id_seq;
       public          postgres    false    220            �           0    0    hourmeter_report_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.hourmeter_report_id_seq OWNED BY public.hourmeter_report.id;
          public          postgres    false    219            �            1259    16867    job_batches    TABLE     d  CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);
    DROP TABLE public.job_batches;
       public         heap    postgres    false            �            1259    16858    jobs    TABLE     �   CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);
    DROP TABLE public.jobs;
       public         heap    postgres    false            �            1259    16857    jobs_id_seq    SEQUENCE     t   CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.jobs_id_seq;
       public          postgres    false    244            �           0    0    jobs_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;
          public          postgres    false    243            �            1259    16624    kontraktor_report    TABLE     =  CREATE TABLE public.kontraktor_report (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    name_admin character varying(255),
    file_admin character varying(255),
    mime_admin character varying(255)
);
 %   DROP TABLE public.kontraktor_report;
       public         heap    postgres    false            �            1259    16623    kontraktor_report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.kontraktor_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.kontraktor_report_id_seq;
       public          postgres    false    226            �           0    0    kontraktor_report_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.kontraktor_report_id_seq OWNED BY public.kontraktor_report.id;
          public          postgres    false    225            �            1259    16912    lokasi    TABLE     [   CREATE TABLE public.lokasi (
    id integer NOT NULL,
    lokasi character varying(100)
);
    DROP TABLE public.lokasi;
       public         heap    postgres    false            �            1259    16911    lokasi_id_seq    SEQUENCE     �   CREATE SEQUENCE public.lokasi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.lokasi_id_seq;
       public          postgres    false    253            �           0    0    lokasi_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.lokasi_id_seq OWNED BY public.lokasi.id;
          public          postgres    false    252                       1259    16940    material    TABLE     _   CREATE TABLE public.material (
    id integer NOT NULL,
    material character varying(100)
);
    DROP TABLE public.material;
       public         heap    postgres    false                       1259    16939    material_id_seq    SEQUENCE     �   CREATE SEQUENCE public.material_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.material_id_seq;
       public          postgres    false    261            �           0    0    material_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.material_id_seq OWNED BY public.material.id;
          public          postgres    false    260            �            1259    16810 
   migrations    TABLE     �   CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);
    DROP TABLE public.migrations;
       public         heap    postgres    false            �            1259    16809    migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.migrations_id_seq;
       public          postgres    false    236            �           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public          postgres    false    235            �            1259    16767    muatan    TABLE     v   CREATE TABLE public.muatan (
    id integer NOT NULL,
    tipe character varying(255),
    jumlah double precision
);
    DROP TABLE public.muatan;
       public         heap    postgres    false            �            1259    16766    muatan_id_seq    SEQUENCE     �   CREATE SEQUENCE public.muatan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.muatan_id_seq;
       public          postgres    false    234            �           0    0    muatan_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.muatan_id_seq OWNED BY public.muatan.id;
          public          postgres    false    233            �            1259    16528    operation_report    TABLE     �  CREATE TABLE public.operation_report (
    id integer NOT NULL,
    tanggal date NOT NULL,
    shift character varying(50) NOT NULL,
    grup character varying(50) NOT NULL,
    pengawas character varying(100) NOT NULL,
    lokasi character varying(100) NOT NULL,
    status character varying(50) NOT NULL,
    pic character varying(50) NOT NULL,
    CONSTRAINT check_status CHECK (((status)::text = ANY (ARRAY['Produksi'::text, 'Jam Jalan'::text])))
);
 $   DROP TABLE public.operation_report;
       public         heap    postgres    false            �            1259    16527    operation_report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.operation_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.operation_report_id_seq;
       public          postgres    false    216            �           0    0    operation_report_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.operation_report_id_seq OWNED BY public.operation_report.id;
          public          postgres    false    215            �            1259    16827    password_reset_tokens    TABLE     �   CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);
 )   DROP TABLE public.password_reset_tokens;
       public         heap    postgres    false            �            1259    16536    production_report    TABLE     M  CREATE TABLE public.production_report (
    id integer NOT NULL,
    operation_report_id integer NOT NULL,
    alat character varying(100) NOT NULL,
    timbunan character varying(100) NOT NULL,
    material character varying(100) NOT NULL,
    jarak double precision NOT NULL,
    tipe character varying(100) NOT NULL,
    ritase integer NOT NULL,
    proses_admin character varying(255) DEFAULT ''::character varying,
    proses_pengawas character varying(255) DEFAULT NULL::character varying,
    proses_kontraktor character varying(255) DEFAULT NULL::character varying,
    alasan_reject character varying(255),
    excecutor character varying(255),
    tipe2 character varying(255),
    ritase2 integer,
    muatan double precision,
    volume double precision,
    total_ritase integer,
    kontraktor character varying(200),
    muatan2 double precision,
    volume2 double precision,
    total_volume double precision,
    name_pengawas character varying(200),
    file_pengawas character varying(200),
    name_kontraktor character varying(200),
    file_kontraktor character varying(200)
);
 %   DROP TABLE public.production_report;
       public         heap    postgres    false            �            1259    16535    production_report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.production_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.production_report_id_seq;
       public          postgres    false    218            �           0    0    production_report_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.production_report_id_seq OWNED BY public.production_report.id;
          public          postgres    false    217            �            1259    16834    sessions    TABLE     �   CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);
    DROP TABLE public.sessions;
       public         heap    postgres    false            �            1259    16898    shift    TABLE     Y   CREATE TABLE public.shift (
    id integer NOT NULL,
    shift character varying(100)
);
    DROP TABLE public.shift;
       public         heap    postgres    false            �            1259    16897    shift_id_seq    SEQUENCE     �   CREATE SEQUENCE public.shift_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.shift_id_seq;
       public          postgres    false    249            �           0    0    shift_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.shift_id_seq OWNED BY public.shift.id;
          public          postgres    false    248                       1259    16933    timbunan    TABLE     _   CREATE TABLE public.timbunan (
    id integer NOT NULL,
    timbunan character varying(100)
);
    DROP TABLE public.timbunan;
       public         heap    postgres    false                       1259    16932    timbunan_id_seq    SEQUENCE     �   CREATE SEQUENCE public.timbunan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.timbunan_id_seq;
       public          postgres    false    259            �           0    0    timbunan_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.timbunan_id_seq OWNED BY public.timbunan.id;
          public          postgres    false    258            �            1259    16614    user_report    TABLE     7  CREATE TABLE public.user_report (
    id integer NOT NULL,
    nama character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    name_admin character varying(255),
    file_admin character varying(255),
    mime_admin character varying(255)
);
    DROP TABLE public.user_report;
       public         heap    postgres    false            �            1259    16613    user_report_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.user_report_id_seq;
       public          postgres    false    224            �           0    0    user_report_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.user_report_id_seq OWNED BY public.user_report.id;
          public          postgres    false    223            �            1259    16817    users    TABLE     x  CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16816    users_id_seq    SEQUENCE     u   CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    238                        0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    237            �           2604    16608    admin_report id    DEFAULT     r   ALTER TABLE ONLY public.admin_report ALTER COLUMN id SET DEFAULT nextval('public.admin_report_id_seq'::regclass);
 >   ALTER TABLE public.admin_report ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    16929    alat id    DEFAULT     b   ALTER TABLE ONLY public.alat ALTER COLUMN id SET DEFAULT nextval('public.alat_id_seq'::regclass);
 6   ALTER TABLE public.alat ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    257    256    257            �           2604    16665    barcode_kontraktor id    DEFAULT     ~   ALTER TABLE ONLY public.barcode_kontraktor ALTER COLUMN id SET DEFAULT nextval('public.barcode_kontraktor_id_seq'::regclass);
 D   ALTER TABLE public.barcode_kontraktor ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229    230            �           2604    16656    barcode_pengawas id    DEFAULT     z   ALTER TABLE ONLY public.barcode_pengawas ALTER COLUMN id SET DEFAULT nextval('public.barcode_pengawas_id_seq'::regclass);
 B   ALTER TABLE public.barcode_pengawas ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    228    227    228            �           2604    16692    equipment id    DEFAULT     l   ALTER TABLE ONLY public.equipment ALTER COLUMN id SET DEFAULT nextval('public.equipment_id_seq'::regclass);
 ;   ALTER TABLE public.equipment ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    232    232            �           2604    16922    executor id    DEFAULT     j   ALTER TABLE ONLY public.executor ALTER COLUMN id SET DEFAULT nextval('public.executor_id_seq'::regclass);
 :   ALTER TABLE public.executor ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    254    255    255            �           2604    16878    failed_jobs id    DEFAULT     p   ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);
 =   ALTER TABLE public.failed_jobs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    246    247    247            �           2604    16908    grup id    DEFAULT     b   ALTER TABLE ONLY public.grup ALTER COLUMN id SET DEFAULT nextval('public.grup_id_seq'::regclass);
 6   ALTER TABLE public.grup ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    250    251    251            �           2604    16551    hourmeter_report id    DEFAULT     z   ALTER TABLE ONLY public.hourmeter_report ALTER COLUMN id SET DEFAULT nextval('public.hourmeter_report_id_seq'::regclass);
 B   ALTER TABLE public.hourmeter_report ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220            �           2604    16861    jobs id    DEFAULT     b   ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);
 6   ALTER TABLE public.jobs ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    243    244    244            �           2604    16627    kontraktor_report id    DEFAULT     |   ALTER TABLE ONLY public.kontraktor_report ALTER COLUMN id SET DEFAULT nextval('public.kontraktor_report_id_seq'::regclass);
 C   ALTER TABLE public.kontraktor_report ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225    226            �           2604    16915 	   lokasi id    DEFAULT     f   ALTER TABLE ONLY public.lokasi ALTER COLUMN id SET DEFAULT nextval('public.lokasi_id_seq'::regclass);
 8   ALTER TABLE public.lokasi ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    252    253    253            �           2604    16943    material id    DEFAULT     j   ALTER TABLE ONLY public.material ALTER COLUMN id SET DEFAULT nextval('public.material_id_seq'::regclass);
 :   ALTER TABLE public.material ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    261    260    261            �           2604    16813    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    235    236    236            �           2604    16770 	   muatan id    DEFAULT     f   ALTER TABLE ONLY public.muatan ALTER COLUMN id SET DEFAULT nextval('public.muatan_id_seq'::regclass);
 8   ALTER TABLE public.muatan ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    233    234    234            �           2604    16531    operation_report id    DEFAULT     z   ALTER TABLE ONLY public.operation_report ALTER COLUMN id SET DEFAULT nextval('public.operation_report_id_seq'::regclass);
 B   ALTER TABLE public.operation_report ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            �           2604    16539    production_report id    DEFAULT     |   ALTER TABLE ONLY public.production_report ALTER COLUMN id SET DEFAULT nextval('public.production_report_id_seq'::regclass);
 C   ALTER TABLE public.production_report ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            �           2604    16901    shift id    DEFAULT     d   ALTER TABLE ONLY public.shift ALTER COLUMN id SET DEFAULT nextval('public.shift_id_seq'::regclass);
 7   ALTER TABLE public.shift ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    249    248    249            �           2604    16936    timbunan id    DEFAULT     j   ALTER TABLE ONLY public.timbunan ALTER COLUMN id SET DEFAULT nextval('public.timbunan_id_seq'::regclass);
 :   ALTER TABLE public.timbunan ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    259    258    259            �           2604    16617    user_report id    DEFAULT     p   ALTER TABLE ONLY public.user_report ALTER COLUMN id SET DEFAULT nextval('public.user_report_id_seq'::regclass);
 =   ALTER TABLE public.user_report ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            �           2604    16820    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    238    237    238            �          0    16605    admin_report 
   TABLE DATA           h   COPY public.admin_report (id, nama, username, password, name_admin, file_admin, mime_admin) FROM stdin;
    public          postgres    false    222   ��       �          0    16926    alat 
   TABLE DATA           (   COPY public.alat (id, alat) FROM stdin;
    public          postgres    false    257   ��       �          0    16662    barcode_kontraktor 
   TABLE DATA           `   COPY public.barcode_kontraktor (id, jabatan, nama, nip, name, file_path, mime_type) FROM stdin;
    public          postgres    false    230   ��       �          0    16653    barcode_pengawas 
   TABLE DATA           ^   COPY public.barcode_pengawas (id, jabatan, nama, nip, name, file_path, mime_type) FROM stdin;
    public          postgres    false    228   E�       �          0    16843    cache 
   TABLE DATA           7   COPY public.cache (key, value, expiration) FROM stdin;
    public          postgres    false    241   ��       �          0    16850    cache_locks 
   TABLE DATA           =   COPY public.cache_locks (key, owner, expiration) FROM stdin;
    public          postgres    false    242   ��       �          0    16689 	   equipment 
   TABLE DATA           =   COPY public.equipment (id, equipment, tipe_unit) FROM stdin;
    public          postgres    false    232   �       �          0    16919    executor 
   TABLE DATA           0   COPY public.executor (id, executor) FROM stdin;
    public          postgres    false    255   ��       �          0    16875    failed_jobs 
   TABLE DATA           a   COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
    public          postgres    false    247   a�       �          0    16905    grup 
   TABLE DATA           (   COPY public.grup (id, grup) FROM stdin;
    public          postgres    false    251   ~�       �          0    16548    hourmeter_report 
   TABLE DATA           H  COPY public.hourmeter_report (id, operation_report_id, equipment, hm_awal, hm_akhir, jam_lain, breakdown, no_operator, hujan, ket, proses_admin, proses_pengawas, proses_kontraktor, alasan_reject, tipe_unit, total_hm, jam_operasi, no_order, kontraktor, name_pengawas, file_pengawas, name_kontraktor, file_kontraktor) FROM stdin;
    public          postgres    false    220   ��       �          0    16867    job_batches 
   TABLE DATA           �   COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
    public          postgres    false    245   "�       �          0    16858    jobs 
   TABLE DATA           c   COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
    public          postgres    false    244   ?�       �          0    16624    kontraktor_report 
   TABLE DATA           m   COPY public.kontraktor_report (id, nama, username, password, name_admin, file_admin, mime_admin) FROM stdin;
    public          postgres    false    226   \�       �          0    16912    lokasi 
   TABLE DATA           ,   COPY public.lokasi (id, lokasi) FROM stdin;
    public          postgres    false    253   ��       �          0    16940    material 
   TABLE DATA           0   COPY public.material (id, material) FROM stdin;
    public          postgres    false    261   <�       �          0    16810 
   migrations 
   TABLE DATA           :   COPY public.migrations (id, migration, batch) FROM stdin;
    public          postgres    false    236   ��       �          0    16767    muatan 
   TABLE DATA           2   COPY public.muatan (id, tipe, jumlah) FROM stdin;
    public          postgres    false    234   ��       �          0    16528    operation_report 
   TABLE DATA           c   COPY public.operation_report (id, tanggal, shift, grup, pengawas, lokasi, status, pic) FROM stdin;
    public          postgres    false    216   r�       �          0    16827    password_reset_tokens 
   TABLE DATA           I   COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
    public          postgres    false    239   ��       �          0    16536    production_report 
   TABLE DATA           Y  COPY public.production_report (id, operation_report_id, alat, timbunan, material, jarak, tipe, ritase, proses_admin, proses_pengawas, proses_kontraktor, alasan_reject, excecutor, tipe2, ritase2, muatan, volume, total_ritase, kontraktor, muatan2, volume2, total_volume, name_pengawas, file_pengawas, name_kontraktor, file_kontraktor) FROM stdin;
    public          postgres    false    218   ��       �          0    16834    sessions 
   TABLE DATA           _   COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
    public          postgres    false    240   o�       �          0    16898    shift 
   TABLE DATA           *   COPY public.shift (id, shift) FROM stdin;
    public          postgres    false    249   ��       �          0    16933    timbunan 
   TABLE DATA           0   COPY public.timbunan (id, timbunan) FROM stdin;
    public          postgres    false    259   ��       �          0    16614    user_report 
   TABLE DATA           g   COPY public.user_report (id, nama, username, password, name_admin, file_admin, mime_admin) FROM stdin;
    public          postgres    false    224   W�       �          0    16817    users 
   TABLE DATA           u   COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at) FROM stdin;
    public          postgres    false    238   ��                  0    0    admin_report_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.admin_report_id_seq', 2, true);
          public          postgres    false    221                       0    0    alat_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.alat_id_seq', 22, true);
          public          postgres    false    256                       0    0    barcode_kontraktor_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.barcode_kontraktor_id_seq', 12, true);
          public          postgres    false    229                       0    0    barcode_pengawas_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.barcode_pengawas_id_seq', 19, true);
          public          postgres    false    227                       0    0    equipment_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.equipment_id_seq', 661, true);
          public          postgres    false    231                       0    0    executor_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.executor_id_seq', 8, true);
          public          postgres    false    254                       0    0    failed_jobs_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);
          public          postgres    false    246                       0    0    grup_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.grup_id_seq', 12, true);
          public          postgres    false    250            	           0    0    hourmeter_report_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.hourmeter_report_id_seq', 2, true);
          public          postgres    false    219            
           0    0    jobs_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.jobs_id_seq', 1, false);
          public          postgres    false    243                       0    0    kontraktor_report_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.kontraktor_report_id_seq', 23, true);
          public          postgres    false    225                       0    0    lokasi_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.lokasi_id_seq', 4, true);
          public          postgres    false    252                       0    0    material_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.material_id_seq', 11, true);
          public          postgres    false    260                       0    0    migrations_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.migrations_id_seq', 3, true);
          public          postgres    false    235                       0    0    muatan_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.muatan_id_seq', 18, true);
          public          postgres    false    233                       0    0    operation_report_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.operation_report_id_seq', 9, true);
          public          postgres    false    215                       0    0    production_report_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.production_report_id_seq', 10, true);
          public          postgres    false    217                       0    0    shift_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.shift_id_seq', 15, true);
          public          postgres    false    248                       0    0    timbunan_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.timbunan_id_seq', 8, true);
          public          postgres    false    258                       0    0    user_report_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.user_report_id_seq', 27, true);
          public          postgres    false    223                       0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public          postgres    false    237            �           2606    16610    admin_report admin_report_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.admin_report
    ADD CONSTRAINT admin_report_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.admin_report DROP CONSTRAINT admin_report_pkey;
       public            postgres    false    222            �           2606    16612 &   admin_report admin_report_username_key 
   CONSTRAINT     e   ALTER TABLE ONLY public.admin_report
    ADD CONSTRAINT admin_report_username_key UNIQUE (username);
 P   ALTER TABLE ONLY public.admin_report DROP CONSTRAINT admin_report_username_key;
       public            postgres    false    222            !           2606    16931    alat alat_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.alat
    ADD CONSTRAINT alat_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.alat DROP CONSTRAINT alat_pkey;
       public            postgres    false    257            �           2606    16669 *   barcode_kontraktor barcode_kontraktor_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.barcode_kontraktor
    ADD CONSTRAINT barcode_kontraktor_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.barcode_kontraktor DROP CONSTRAINT barcode_kontraktor_pkey;
       public            postgres    false    230            �           2606    16660 &   barcode_pengawas barcode_pengawas_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.barcode_pengawas
    ADD CONSTRAINT barcode_pengawas_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.barcode_pengawas DROP CONSTRAINT barcode_pengawas_pkey;
       public            postgres    false    228                       2606    16856    cache_locks cache_locks_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);
 F   ALTER TABLE ONLY public.cache_locks DROP CONSTRAINT cache_locks_pkey;
       public            postgres    false    242                       2606    16849    cache cache_pkey 
   CONSTRAINT     O   ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);
 :   ALTER TABLE ONLY public.cache DROP CONSTRAINT cache_pkey;
       public            postgres    false    241            �           2606    16694    equipment equipment_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.equipment DROP CONSTRAINT equipment_pkey;
       public            postgres    false    232                       2606    16924    executor executor_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.executor
    ADD CONSTRAINT executor_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.executor DROP CONSTRAINT executor_pkey;
       public            postgres    false    255                       2606    16883    failed_jobs failed_jobs_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_pkey;
       public            postgres    false    247                       2606    16885 #   failed_jobs failed_jobs_uuid_unique 
   CONSTRAINT     ^   ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);
 M   ALTER TABLE ONLY public.failed_jobs DROP CONSTRAINT failed_jobs_uuid_unique;
       public            postgres    false    247                       2606    16910    grup grup_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.grup
    ADD CONSTRAINT grup_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.grup DROP CONSTRAINT grup_pkey;
       public            postgres    false    251            �           2606    16555 &   hourmeter_report hourmeter_report_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.hourmeter_report
    ADD CONSTRAINT hourmeter_report_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.hourmeter_report DROP CONSTRAINT hourmeter_report_pkey;
       public            postgres    false    220                       2606    16873    job_batches job_batches_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.job_batches DROP CONSTRAINT job_batches_pkey;
       public            postgres    false    245                       2606    16865    jobs jobs_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.jobs DROP CONSTRAINT jobs_pkey;
       public            postgres    false    244            �           2606    16629 (   kontraktor_report kontraktor_report_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.kontraktor_report
    ADD CONSTRAINT kontraktor_report_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.kontraktor_report DROP CONSTRAINT kontraktor_report_pkey;
       public            postgres    false    226            �           2606    16631 0   kontraktor_report kontraktor_report_username_key 
   CONSTRAINT     o   ALTER TABLE ONLY public.kontraktor_report
    ADD CONSTRAINT kontraktor_report_username_key UNIQUE (username);
 Z   ALTER TABLE ONLY public.kontraktor_report DROP CONSTRAINT kontraktor_report_username_key;
       public            postgres    false    226                       2606    16917    lokasi lokasi_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.lokasi
    ADD CONSTRAINT lokasi_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.lokasi DROP CONSTRAINT lokasi_pkey;
       public            postgres    false    253            %           2606    16945    material material_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.material DROP CONSTRAINT material_pkey;
       public            postgres    false    261                        2606    16815    migrations migrations_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.migrations DROP CONSTRAINT migrations_pkey;
       public            postgres    false    236            �           2606    16772    muatan muatan_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.muatan
    ADD CONSTRAINT muatan_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.muatan DROP CONSTRAINT muatan_pkey;
       public            postgres    false    234            �           2606    16534 &   operation_report operation_report_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.operation_report
    ADD CONSTRAINT operation_report_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.operation_report DROP CONSTRAINT operation_report_pkey;
       public            postgres    false    216                       2606    16833 0   password_reset_tokens password_reset_tokens_pkey 
   CONSTRAINT     q   ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);
 Z   ALTER TABLE ONLY public.password_reset_tokens DROP CONSTRAINT password_reset_tokens_pkey;
       public            postgres    false    239            �           2606    16541 (   production_report production_report_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.production_report
    ADD CONSTRAINT production_report_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.production_report DROP CONSTRAINT production_report_pkey;
       public            postgres    false    218            	           2606    16840    sessions sessions_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public            postgres    false    240                       2606    16903    shift shift_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.shift
    ADD CONSTRAINT shift_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.shift DROP CONSTRAINT shift_pkey;
       public            postgres    false    249            #           2606    16938    timbunan timbunan_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.timbunan
    ADD CONSTRAINT timbunan_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.timbunan DROP CONSTRAINT timbunan_pkey;
       public            postgres    false    259            �           2606    16619    user_report user_report_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.user_report
    ADD CONSTRAINT user_report_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.user_report DROP CONSTRAINT user_report_pkey;
       public            postgres    false    224            �           2606    16621 $   user_report user_report_username_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.user_report
    ADD CONSTRAINT user_report_username_key UNIQUE (username);
 N   ALTER TABLE ONLY public.user_report DROP CONSTRAINT user_report_username_key;
       public            postgres    false    224                       2606    16826    users users_email_unique 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_unique;
       public            postgres    false    238                       2606    16824    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    238                       1259    16866    jobs_queue_index    INDEX     B   CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);
 $   DROP INDEX public.jobs_queue_index;
       public            postgres    false    244                       1259    16842    sessions_last_activity_index    INDEX     Z   CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);
 0   DROP INDEX public.sessions_last_activity_index;
       public            postgres    false    240            
           1259    16841    sessions_user_id_index    INDEX     N   CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);
 *   DROP INDEX public.sessions_user_id_index;
       public            postgres    false    240            '           2606    16556 :   hourmeter_report hourmeter_report_operation_report_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.hourmeter_report
    ADD CONSTRAINT hourmeter_report_operation_report_id_fkey FOREIGN KEY (operation_report_id) REFERENCES public.operation_report(id) ON DELETE CASCADE;
 d   ALTER TABLE ONLY public.hourmeter_report DROP CONSTRAINT hourmeter_report_operation_report_id_fkey;
       public          postgres    false    220    4838    216            &           2606    16542 <   production_report production_report_operation_report_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.production_report
    ADD CONSTRAINT production_report_operation_report_id_fkey FOREIGN KEY (operation_report_id) REFERENCES public.operation_report(id) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public.production_report DROP CONSTRAINT production_report_operation_report_id_fkey;
       public          postgres    false    4838    218    216            �   �   x�u��N�@E���� �f���I��PD�f�X*-��h�^�MLL�ܜ�ͽ�8��kz��#�'��Up�{+�h�pS�7G�'^���$��[S�V�!�J{�h�\;����͹5>C�#Nۖh����~���?�K�	�����e�*펿n��:YȍY��s�qy_*mpd��c�ɴ��C,�<�^�� D|6������~�0Oe      �   �   x���=k�0�Y�7�C�����(SA�)��ٺ(:4q�����=�i��ppz�T���H�� �s� �o'�A��;Pc���*2Zyޔ��m�;qީ����ω�v�Q}�D�#��;0=��v��t��ǯ<B���o��{�����HS-	U$f/^Q9��7��?0(�Ԏ���r������Yk����_M��ӹ�G�t�\�)?��W��6�      �   �   x�m��� �gx���P>�~<�cW
�6Fh(���N�8�]r��!��ܪ��R;8Ri������[i�I;wfK�c��k(1��F�E0Ip͔���6?����Q��.���5ZIdؖT���~�3�2�{d����p��R��7?�      �   v  x����n�0E��W��\��,���B�6���Am����)���W�\sp5������������,/��ѹ-÷,ڣ�.ʸ���n�ןO������ۃTt�8��Z9S�� �w�����=�Ӂ�ΠY�֏��o�`S8lY� &�50n1���`Yq<��{I��׍l�ʰN��8�vϊS����js�X_���X$�D,�Fq����uc��aY_+��C7��۷nH���(�R��pδQV�9����᧎!n���BY�yW$d$�"j�ȱ+r�l}t>oS8z3j33���FĊ�"U��Ν�i�g�$K̢7NV�55R(��-��n��;����<A�@�D4�"��ސ/c�eѠ�&F*V`/C0pp>���{�����~H��:/ ��X�w񥎙Qk4ce��������XuI)�y�3�Rl��L� D��A�\^�d=�W���"��Հ�A>H���:%� �ȅMp��*��f<�g�P�IAQ���3�9��-�*��!���Q�|ХLa1�0�&���<H+*��=��p>�qN��ͬ��(�)����0*�n�Ϩw]Q�.�#��� Ê3Fݽ�-���A�r웤�*��L�@"
�q�Ǉ��/wvTZ      �      x������ � �      �      x������ � �      �      x��[ێ9�}��"g�P����Q�ʲ�-��Rڮ10<��E�g�A�۟��$��dj^ڝ'�̈�Yrs��/;�����y?\�w����a'�Yl�?��ԛ����ח_~|���߶��B��ޛ~w���2d6o��y���ׯ����Q3G��a��y8��[ez��$m�9���⏻�����V
�����Vbk���x>��vs/����V��h�ˈ�G/�������a@��<�;�6�a�IH�>>������5k.;��Jg&6��*%�;\]��br�I�&�
暬��wJuN�V�h�m�G�Was~���7����y�τ�9���x��N����9o�Z��R	2�	R�����
��]��V>��f($�%���g({���=d(y�����{Hއ���Q¹>�������}��/H�2���6��� �u�P�u6�T��ˡ����e�FD��AS��)7�F���u�ы��ص{���;4�W�h���*�<���%M3O[c�$�h�\��)�3�$sL&%*�ؔ���b�D�7R	�����DYHPΊ5	������bO�b}j�snC�r�s�?K��s0�#w9��K��K��K��s	����d���dx���O��̏O���O���Oޫ�Oޫ�Oޫ�Oޫ�Oޫ�Oޫ�}Hޫ�}Hޫ�}Hޫ�}Hޫ�}H���}H���}H���}H���}H���=v��J�{Zm����H"L�0I�2���<>I�%W(���:%�rW�7I�q���ZLJ�O�kWlle�V�f+7��7[���lŹ4�_��˱�@�5Q%���;̭w���V�f+5�r7[鱕��
�V�f��s�G�Z��뛙�#��ff�ȹ���1���̨�{}�{�F��cQ�4̴��4δ��<����&,5���	K�Ԅ���:N���r^��?�i��N"���.���t��s��e#�C]�C�#f���O�a��q����	�@� g��"	�%�q%�	�%��Aa*p�HJ���)QnJ
�D�))���L)M���ԹLL���&�8dl琅<�3���.u�R�us��?�?�q�����K%��'�,�I
7���@����	��Y��RJd�ZK)�ej-�D����Y��Ɣ���6�h�����a�f�({h푳����������fv�iŰʞ�bXeOs1���9
K�=���P%��F�*)D����?6o�~����/ߺ��?~|}���h,�����F�q?�������{��t��D�������I|J��nS���$seG�ΕI�$�d�G ���<���2����Ѩ�����	�%έE�Q4�FQ7B��c�((�4L�4�Ol��؂�YR.V�b�nl�X��FTo !����r!�c��q�v���Kk_�O���
���v%B}W����C�P�Q"�wA���J�fv(&L$!P"�3�>K�J�i�[��L�X�Q<�]Ià��Q���V�'��hwl�UJ�{���h����Kv%~�I�=JA�z�v��Z�e{���}3ہ�k�+�����gV�c�̪̟]����k�i�Ϯ��";Lc�P:�~6��W���Jf������"
�!L�Pz~؁����G-N�cj+��r4�OC��O�{�a���AQ�!�a��q<o��ᓌOz|��ET �뉸���/�o3��Hnc�S�b	g��yw�A����뀖�/άKK��ׅ�D�q�]Z(*�,-*Z�1:ZZ߁hi}�D�kXl����EKhX�*e,-a��������*X����Va��pűx�`���g�x�a����a�G�����*�Iэ����=�{����R	AY�A�s���0��X2��pȶ�އ�Ӈ���ޝ��!�ɮZv�iɮ�v��д�l7M��v۴C����d�o�m����%;f�e���&.�'���̟l��3������O /�O[*J'�(Pg�;�/�T��n�n�����|�>q<��eKuhF��>���[*E.8\�	=�0�1�������Ќ�p9�c���˷�����_~�����k���o��p�}ݬ��J�T��#	U�ix?��(�h�m%���HB�%�ɪ4�J.5Q����]���#Ͷ(�Lr�&�������_���oi>{�� 4�X�@`��6�s!f/��.���,ȸ�p?��Q��(M��8)�����)�
��A�y�n�T��A��Sj�������A���"��i�J*�r�et����K��/�T�=�������׎���ӻ-�w�c쑓����˨�z��"��_�g?==��5�[�0z�PnE��QC���G�V4�5�[јz�P��=d;kPW��}�%-�oE�,D݊P�zr��E*ǑݯE*�E�	�I��$0�a-I�Ik�&1�%�İ���k$�G���06X�&`��.ر�G��k=��=�r(�i����y8m5ʎ7ϱ��t�x����]�0���m� �ցL"h-��	������g���a3����a~������}ߎ=l-;v�akڱ��h����Ml� *�]����k;�|5G������h��(C���&�y6����q��I_�.Ֆ�:��Ff �lW���VSlYôc0n�/�-Z�r�������C;-���v>Z�a�w����]�n>K7��$4h�0Oh�8O(dT�ɨ.P�Q�|���-�@�ӗ����~'m�	�d(�\��1R�n�U$I�^������AȠ�@
1�%�6�z]a}����O�6�.$7O0WW ��.�.���G�� ]c�	���f��
�o4j� �Qtƭ���>[m���/���54��&C�l��P�4t��4�z<�_���ŀ*}����ǒ�T�Fe�*�A�;�t��z��P���|9>�=>����V8�֬�C���K�i���.B�*���	����y!^бu�>S?���/؍Pt���/?��������	ta7b�S��s�vz��M8.,%�2.g�ϸ��!��IU�8��|��><�+cA��j�B�W��y���Y��ϫ��y����:c=�W�[g���js�L��i	T�� u�����h��0 G�U	�'Dy�r�D��( �J"[U�\%��*
@���V`����( �J�ZU�\%Q�*
�\%Q�*
��ʤZU0�?ժ�����&�&���̟j�k2�ɯ��k�k2��/I�O��f��"3bGD����t�o��	td;��[�@������	Q�6�mfa�S�[W��#�ō��E�JC�\��:0Bw�[p\K_ⱪn�kT<�-����7�����X�^�\�^��-p�B�K�zS�j�S��,�X}�8����� �� �Klq�<��u%�Pg�:�=�_w�ǡG�F����3,DL�X�3LFf��Ҹ/�!h�$ռ�K&��PQ��Lwhh�R���&Dgµ
Yy�ZZ��B1���f���`�4�]Ŵ���?��5#ϻ����n�6<B����:9;+2"�.�ŅW��ZU � ���"�-~�t�c��.��-�r�K��u���|C���!i��:|N����J!݄�=ć=rWč4��������t�Wma.��JD].7�p��u�������7�a��Tş9t�+mR�Q���/*M*�R�]�ʀ� L ��4���4е��WZqΏ�ݻ������m6�|��-4m�lTk�SLW���t`��zD�^�2��U����"�x��6"��Y�1f��K�x�2��\�1^���ʀ���b.1�P&,ƪ]��h����E���FY��ψ�H�~F8����O���dSc F���nKW��*����c�u������f�q�w������؉��}Z>�ix�5ӑ�1<��w��}Ѯ�L}]Ș�_|���Dy�]��]`��|F��rGǯ8�B�	��0�hm���D���z*a�Λbz���l1!M�c]1c��.|���rbs�x�/p�ɂg���8QY����D�)���M�M�l�6h��L �  �f�f[6�6ײy���-�-4l�U�=φ�y�-^<�"[�x�E�x�̋l�����3/�ŋg^d�ϼ�/�y�-^�Z��E�x	̋j����%0/��K`^T�����/�yQ-^�Z��E5x��y�^��m^�`^t�+����
�E7x��y�^�`^t�+����
�E7x��y�-^$�-^$�-^p ]{�(9�]��a=�j��9lF�a3���9�G��a�Q��Ǐ��~O�n-��"e'g�� ��`Ű�`Ͱ�``�V�a�U�e�W�c8T0+R��W�h�RV�h�RV�h�RBs���Rs���Rs���Rs���Rs���Rs���Rs���8JUE	����RUQG��(��TU��Q�*J�(U%p���8J]E	���4���4���4���4���4���4���4���4���4%TQ�f;��t�ǒ`���삉��,�����i���?q�k      �   `   x�3��P�4U�UQ	rTp�vvTptrt��2�(14711ƭʄ����;$���(�	Q���� T����e3����I1z\\\ �$      �      x������ � �      �       x���t�24�t�24�t�24�t����� ,^      �   d   x�3�4��100�44�42 r�01�3� '?1%5�3��|=B",�@j�9`�e�i���bn�kdn	6���y.
�@E���@��L����� q!      �      x������ � �      �      x������ � �      �   �  x�u�M��@����=xn���f���� ���"f.�|�0|�4A�n6'��M*�'E�`QM�gMY�"����谋��Nt],Wn���*�,�&p�zYLn�"��t�ܸ��UE2@H�Z�a�q����r�bd &/��ki�'��o�n������+'_ݶ��QG�p�}������F]�v��r�n�rf����wtTOAR@,c@�ú�A�������j{�����+�\2+.�u=��V���x�ք���bNp3�Z���%F\���P�)�wP8��m��u�o;�K$���u�3+��i~�e�����6�` �����w����u�s[{fn9.M���+���~�إ�n�@���ړ!=��$�	�?�p8���`      �   5   x�3�tJ���WpJ,J,Q�U�Q0�2�����'f@��B<}C��b���� ���      �   \   x�3��wRp�2Q��\�`ڈ˄ӿ,�(��(%5�˔ӧ4����ˌ3$��8?3����ə�LqYrz��5@u M64+1����� d�      �   E   x�3�4000��"0�O.JM,I�/-N-*�/IL�I�4�2�PhS�����
Wh����0+?	a`� ��$      �   e   x�]̱@@E�z�+^I���0���(�D��D4���t�8�F�KA}+OT�x�HRR�*,FS��u�W>W���n��J�N�c?6��4~�W��7�      �     x���Mo�0��s�*�����ܭ�R��e�&�I�`��F&#d����ɷ�Q��-J-�t�?���#B��Y�4�k$P ����H�P,rM�+�5�ك�̀��*ׇ]�����󺬀c�2t�q�lS<�����H�^�Ƽ���Q~	5�U��$~�t
s��4�Yo�¼�¼��t�݂���{�z9���c�}J{+H����z��3��/{����I7������n�N��Z�x���)�~�X��?B�9A3(ߓ �@.���I?�0��6 a      �      x������ � �      �   �  x����O�0�Ϗ���@�׭�z�d����p�a�Eѿ��E�������_����
 �H�=L&s30���``�op�$$�v!L��5��xJ���~��Y��+�e�t���;t���[�|d����2+@I�Q��J�#��i��/�o�8G3�M���j�.�%,�ՈF��L������ؠm�M8��\DB�v��~z�Y�;.�=��5�|�n�&j��-(�Z�j[I~ks�bJ��ӓ0��KB��	ͺ(�H��iy�K���j�Q�U�:�uUdC˲�.�{�=��'V�6H~]J[��$#�T�W�;�5-�+ڳ�A�LO)�u�g���s5s%H�0{E�R�^!�=�7��o��̀�f?���1�y���BC$��~o~�X{��KR~�+u¶F���s�>����|�g��      �      x������ � �      �   E   x�34���L+Q0T�P02�20P(�OQ00�4�M��F@i� H��*m
�6JCA�s4�b���� 9��      �   f   x�3�tJ���WI�KO�P�Up�,.�/N�Q-I,JT�,Q0V��--�2Ʃ685'�$1E�	T�Иl����Z��Lq)vJL�N����3�8�+F��� 	�;s      �   �  x�u�K��0����Y�IHYj506��H[�!��F�b�~�j\�S��{6߃������em��@�X�a���������5H�Ƣ�
����)_[�8;x�s2,Co���o�Y�0��t�$�&,�X���.AK�9���4����Q��7�Ӵ٠��@��嶽&�t5�fv���Ynw�(��b �O3#5 �� H	V��"�yw�v6�+nu�U��_
��*ڗ��zۏgf�y�u�昐1{�
"�P!�HE�)�DdwЇ����kThj��t?��~W~	ຼh<��jǺ�m��%2F(�@�9�2#� �h�Ӹ�j'j|m��x^q�2MZG���2��Jx�"SYIW�Ѹ����1U 2Ǆ̞@��|>�s��      �      x������ � �     